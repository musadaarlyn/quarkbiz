package com.codebiz.dao;

import com.codebiz.model.TechStack;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class TechStackDao {

    @Inject
    DataSource dataSource;

    // CREATE
    // -------------------------------------------------------------------------- >
    public void create(TechStack tech) {
        String sql = """
                    INSERT INTO tech_stack (tsName, tsDescription, categoryId)
                    VALUES (?, ?, ?)
                """;

        try (
                Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);) {
            ps.setString(1, tech.tsName);
            ps.setString(2, tech.tsDescription);
            ps.setLong(3, tech.category);

            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    tech.id = keys.getLong(1);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to insert tech", e);
        }
    }

    // READ
    // -------------------------------------------------------------------------- >
    // FIND ALL
    public List<TechStack> findAll() {
        List<TechStack> techs = new ArrayList<>();

        String sql = """
                    SELECT id, tsName, tsDescription, categoryId, createdAt, updatedAt
                    FROM tech_stack
                    ORDER BY createdAt DESC
                """;

        try (
                Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                techs.add(mapRow(rs));
            }

        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch tech stacks", e);
        }

        return techs;
    }

    // FIND BY ID
    public TechStack findById(Long id) {
        String sql = """
                    SELECT id, tsName, tsDescription, categoryId, createdAt, updatedAt
                    FROM tech_stack
                    WHERE id =?
                """;

        try (
                Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql);) {

            ps.setLong(1, id);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch tech by id", e);
        }

        return null;
    }

    // UPDATE
    // -------------------------------------------------------------------------- >
    public void update(TechStack tech) {
        String sql = """
                    UPDATE tech_stack
                    SET tsName = ?, tsDescription = ?, updatedAt = NOW()
                    WHERE id = ?
                """;

        try (
                Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, tech.tsName);
            ps.setString(2, tech.tsDescription);
            ps.setLong(3, tech.id);

            ps.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Failed to update tech", e);
        }
    }

    // DELETE
    // -------------------------------------------------------------------------- >
    public void delete(TechStack tech) {
        String sql = """
                    DELETE from tech_stack
                    WHERE id = ?
                """;

        try (
                Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql);) {
            ps.setLong(1, tech.id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to delete tech", e);
        }
    }

    // VALIDATION HELPERS
    // -------------------------------------------------------------------------- >
    public boolean existsByNameIgnoreCase(String name) {
        String sql = """
                SELECT 1
                FROM tech_stack
                WHERE LOWER(tsName) = LOWER(?)
                LIMIT 1
                """;

        try (
                Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql);) {

            ps.setString(1, name);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }

        } catch (SQLException e) {
            throw new RuntimeException("Failed to check tech existence", e);
        }
    }

    public TechStack findByNameIgnoreCase(String name) {
        String sql = """
                    SELECT id, tsName, tsDescription, createdAt, updatedAt
                    FROM tech_stack
                    WHERE LOWER(tsName) = LOWER(?)
                    LIMIT 1
                """;

        try (
                Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql);) {
            ps.setString(1, name);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch tech by name", e);
        }

        return null;
    }

    public boolean isUsedByProject(Long id) {
        String sql = """
                    SELECT 1
                    FROM projects
                    WHERE JSON_CONTAINS(techStackIds, CAST(? AS JSON))
                    LIMIT 1;
                """;

        try (
                Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql);) {
            ps.setLong(1, id);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to check project dependency", e);
        }
    }

    // ROW MAPPER
    // -------------------------------------------------------------------------- >
    private TechStack mapRow(ResultSet rs) throws SQLException {

        TechStack t = new TechStack();
        t.id = rs.getLong("id");
        t.tsName = rs.getString("tsName");
        t.tsDescription = rs.getString("tsDescription");
        t.category = rs.getLong("categoryId");

        Timestamp created = rs.getTimestamp("createdAt");
        Timestamp updated = rs.getTimestamp("updatedAt");

        t.createdAt = created != null ? created.toLocalDateTime() : null;
        t.updatedAt = updated != null ? updated.toLocalDateTime() : null;

        return t;
    }

}
