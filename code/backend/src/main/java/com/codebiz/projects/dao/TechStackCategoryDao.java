package com.codebiz.projects.dao;

import com.codebiz.projects.model.TechStackCategory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class TechStackCategoryDao {

    @Inject
    DataSource dataSource;

    private static final List<String> ALLOWED_SORT_FIELDS = List.of("tscName", "createdAt", "updatedAt");

    // FIND ALL
    // -------------------------------------------------------------------------- >
    public List<TechStackCategory> findAll() {
        List<TechStackCategory> categories = new ArrayList<>();

        String sql = """
                    SELECT id, tscName, tscDescription, createdAt, updatedAt
                    FROM tech_stack_category
                    ORDER BY createdAt DESC
                """;

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                categories.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch categories", e);
        }

        return categories;
    }

    // FIND BY ID
    // -------------------------------------------------------------------------- >
    public TechStackCategory findById(Long id) {
        String sql = """
                    SELECT id, tscName, tscDescription, createdAt, updatedAt
                    FROM tech_stack_category
                    WHERE id = ?
                """;

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch category by id", e);
        }

        return null;
    }

    // PAGINATION
    // -------------------------------------------------------------------------- >
    public List<TechStackCategory> findPaginated(int page, int size) {
        List<TechStackCategory> categories = new ArrayList<>();

        String sql = """
                    SELECT id, tscName, tscDescription, createdAt, updatedAt
                    FROM tech_stack_category
                    ORDER BY createdAt DESC
                    LIMIT ? OFFSET ?
                """;

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, size);
            ps.setInt(2, page * size);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    categories.add(mapRow(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to paginate categories", e);
        }

        return categories;
    }

    // SEARCH , SORT , PAGINATION
    // -------------------------------------------------------------------------- >
    public List<TechStackCategory> search(
            String name,
            String sortField,
            String direction,
            int page,
            int size) {
        List<TechStackCategory> categories = new ArrayList<>();

        String safeSortField = ALLOWED_SORT_FIELDS.contains(sortField)
                ? sortField
                : "createdAt";

        String safeDirection = "desc".equalsIgnoreCase(direction)
                ? "DESC"
                : "ASC";

        String sql = """
                    SELECT id, tscName, tscDescription, createdAt, updatedAt
                    FROM tech_stack_category
                    WHERE (? IS NULL OR LOWER(tscName) LIKE LOWER(?))
                    ORDER BY %s %s
                    LIMIT ? OFFSET ?
                """.formatted(safeSortField, safeDirection);

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            if (name == null || name.isBlank()) {
                ps.setNull(1, Types.VARCHAR);
                ps.setNull(2, Types.VARCHAR);
            } else {
                ps.setString(1, name);
                ps.setString(2, "%" + name + "%");
            }

            ps.setInt(3, size);
            ps.setInt(4, page * size);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    categories.add(mapRow(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to search categories", e);
        }

        return categories;
    }

    // CREATE
    // -------------------------------------------------------------------------- >
    public void insert(TechStackCategory category) {
        String sql = """
                    INSERT INTO tech_stack_category (tscName, tscDescription)
                    VALUES (?, ?)
                """;

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, category.tscName);
            ps.setString(2, category.tscDescription);

            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    category.id = keys.getLong(1);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to insert category", e);
        }
    }

    // UPDATE
    // -------------------------------------------------------------------------- >
    public void update(TechStackCategory category) {
        String sql = """
                    UPDATE tech_stack_category
                    SET tscName = ?, tscDescription = ?, updatedAt = NOW()
                    WHERE id = ?
                """;

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, category.tscName);
            ps.setString(2, category.tscDescription);
            ps.setLong(3, category.id);

            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to update category", e);
        }
    }

    // DELETE
    // -------------------------------------------------------------------------- >
    public void delete(Long id) {
        String sql = "DELETE FROM tech_stack_category WHERE id = ?";

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to delete category", e);
        }
    }

    // VALIDATION HELPERS
    // -------------------------------------------------------------------------- >
    public boolean existsByNameIgnoreCase(String name) {
        String sql = """
                    SELECT 1
                    FROM tech_stack_category
                    WHERE LOWER(tscName) = LOWER(?)
                    LIMIT 1
                """;

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, name);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to check category existence", e);
        }
    }

    public TechStackCategory findByNameIgnoreCase(String name) {
        String sql = """
                    SELECT id, tscName, tscDescription, createdAt, updatedAt
                    FROM tech_stack_category
                    WHERE LOWER(tscName) = LOWER(?)
                    LIMIT 1
                """;

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, name);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch category by name", e);
        }

        return null;
    }

    public long countTechStacks(Long categoryId) {
        String sql = """
                    SELECT COUNT(*)
                    FROM tech_stack
                    WHERE categoryId = ?
                """;

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, categoryId);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to count tech stacks", e);
        }

        return 0;
    }

    // ROW MAPPER
    // -------------------------------------------------------------------------- >
    private TechStackCategory mapRow(ResultSet rs) throws SQLException {
        TechStackCategory c = new TechStackCategory();
        c.id = rs.getLong("id");
        c.tscName = rs.getString("tscName");
        c.tscDescription = rs.getString("tscDescription");

        Timestamp created = rs.getTimestamp("createdAt");
        Timestamp updated = rs.getTimestamp("updatedAt");

        c.createdAt = created != null ? created.toLocalDateTime() : null;
        c.updatedAt = updated != null ? updated.toLocalDateTime() : null;

        return c;
    }
}
