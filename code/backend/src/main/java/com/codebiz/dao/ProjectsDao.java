package com.codebiz.dao;

import com.codebiz.model.Projects;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class ProjectsDao {

    @Inject
    DataSource dataSource;

    @Inject
    ObjectMapper objectMapper;

    // CREATE
    // -------------------------------------------------------------------------- >
    public void create(Projects project) {

        String sql = """
                    INSERT INTO projects
                    (projName, projDescription, techStackIds, status, startDate, endDate, createdAt, updatedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, project.projName);
            ps.setString(2, project.projDescription);
            ps.setString(3, toJson(project.techStackIds));
            ps.setString(4, project.status);
            ps.setObject(5, project.startDate);
            ps.setObject(6, project.endDate);
            ps.setTimestamp(7, Timestamp.valueOf(project.createdAt));
            ps.setTimestamp(8, Timestamp.valueOf(project.updatedAt));

            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    project.id = keys.getLong(1);
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to insert project", e);
        }
    }

    // READ
    // -------------------------------------------------------------------------- >
    public List<Projects> findAll() {
        String sql = "SELECT * FROM projects ORDER BY createdAt DESC";
        List<Projects> projects = new ArrayList<>();

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                projects.add(mapRow(rs));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch projects", e);
        }

        return projects;
    }

    public Projects findById(Long id) {
        String sql = "SELECT * FROM projects WHERE id = ?";

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch project by id", e);
        }

        return null;
    }

    // UPDATE
    // -------------------------------------------------------------------------- >
    public void update(Projects project) {

        String sql = """
                    UPDATE projects
                    SET projName = ?, projDescription = ?, techStackIds = ?, status = ?,
                        startDate = ?, endDate = ?, updatedAt = ?
                    WHERE id = ?
                """;

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, project.projName);
            ps.setString(2, project.projDescription);
            ps.setString(3, toJson(project.techStackIds));
            ps.setString(4, project.status);
            ps.setObject(5, project.startDate);
            ps.setObject(6, project.endDate);
            ps.setTimestamp(7, Timestamp.valueOf(project.updatedAt));
            ps.setLong(8, project.id);

            ps.executeUpdate();

        } catch (Exception e) {
            throw new RuntimeException("Failed to update project", e);
        }
    }

    // DELETE
    // -------------------------------------------------------------------------- >
    public boolean delete(Long id) {
        String sql = "DELETE FROM projects WHERE id = ?";

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            return ps.executeUpdate() > 0;

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete project", e);
        }
    }

    // VALIDATION HELPERS
    // -------------------------------------------------------------------------- >
    public boolean existsByNameIgnoreCase(String name) {
        String sql = "SELECT 1 FROM projects WHERE LOWER(projName) = LOWER(?) LIMIT 1";

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, name);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean existsByNameIgnoreCaseExceptId(Long id, String name) {
        String sql = """
                    SELECT 1 FROM projects
                    WHERE LOWER(projName) = LOWER(?) AND id <> ?
                    LIMIT 1
                """;

        try (
                Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, name);
            ps.setLong(2, id);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // ROW MAPPER
    // -------------------------------------------------------------------------- >
    private Projects mapRow(ResultSet rs) throws Exception {
        Projects p = new Projects();
        p.id = rs.getLong("id");
        p.projName = rs.getString("projName");
        p.projDescription = rs.getString("projDescription");
        p.status = rs.getString("status");

        p.techStackIds = fromJson(rs.getString("techStackIds"));

        Date start = rs.getDate("startDate");
        Date end = rs.getDate("endDate");

        p.startDate = start != null ? start.toLocalDate() : null;
        p.endDate = end != null ? end.toLocalDate() : null;

        p.createdAt = rs.getTimestamp("createdAt").toLocalDateTime();
        p.updatedAt = rs.getTimestamp("updatedAt").toLocalDateTime();

        return p;
    }

    // JSON HELPERS
    // -------------------------------------------------------------------------- >
    private String toJson(List<Long> ids) throws Exception {
        return objectMapper.writeValueAsString(ids);
    }

    private List<Long> fromJson(String json) throws Exception {
        if (json == null)
            return List.of();
        return objectMapper.readValue(json, new TypeReference<>() {
        });
    }
}
