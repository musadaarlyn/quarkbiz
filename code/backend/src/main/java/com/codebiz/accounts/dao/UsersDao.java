package com.codebiz.accounts.dao;

import com.codebiz.accounts.model.users.User;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class UsersDao {

    @Inject
    DataSource dataSource;

    // CREATE
    // -------------------------------------------------------------------------- >
    public void create(User user) {
        String sql = """
                INSERT INTO users
                (username, password_hash, displayName, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?)
                """;

        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, user.username);
            ps.setString(2, user.password_hash);
            ps.setString(3, user.displayName);
            ps.setTimestamp(4, user.createdAt != null ? Timestamp.valueOf(user.createdAt)
                    : Timestamp.valueOf(java.time.LocalDateTime.now()));
            ps.setTimestamp(5, user.updatedAt != null ? Timestamp.valueOf(user.updatedAt) : null);

            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    user.id = keys.getLong(1);
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to insert user", e);
        }
    }

    // READ ALL
    // -------------------------------------------------------------------------- >
    public List<User> findAll() {
        String sql = "SELECT * FROM users ORDER BY createdAt DESC";
        List<User> users = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                users.add(mapRow(rs));
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch users", e);
        }

        return users;
    }

    // FIND BY ID
    // -------------------------------------------------------------------------- >
    public User findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch user by id", e);
        }

        return null;
    }

    // FIND BY USERNAME
    // -------------------------------------------------------------------------- >
    public User findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ?";

        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch user by username", e);
        }

        return null;
    }

    // UPDATE
    // -------------------------------------------------------------------------- >
    public void update(User user) {
        String sql = """
                UPDATE users
                SET username = ?, password_hash = ?, displayName = ?, updatedAt = ?
                WHERE id = ?
                """;

        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, user.username);
            ps.setString(2, user.password_hash);
            ps.setString(3, user.displayName);
            ps.setTimestamp(4, user.updatedAt != null ? Timestamp.valueOf(user.updatedAt)
                    : Timestamp.valueOf(java.time.LocalDateTime.now()));
            ps.setLong(5, user.id);

            ps.executeUpdate();

        } catch (Exception e) {
            throw new RuntimeException("Failed to update user", e);
        }
    }

    // DELETE
    // -------------------------------------------------------------------------- >
    public boolean delete(Long id) {
        String sql = "DELETE FROM users WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            return ps.executeUpdate() > 0;

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete user", e);
        }
    }

    // VALIDATION HELPERS
    // -------------------------------------------------------------------------- >
    public boolean existsByUsername(String username) {
        String sql = "SELECT 1 FROM users WHERE username = ? LIMIT 1";

        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to check username existence", e);
        }
    }

    // ROW MAPPER
    // -------------------------------------------------------------------------- >
    private User mapRow(ResultSet rs) throws SQLException {
        User user = new User();
        user.id = rs.getLong("id");
        user.username = rs.getString("username");
        user.password_hash = rs.getString("password_hash");
        user.displayName = rs.getString("displayName");

        Timestamp created = rs.getTimestamp("createdAt");
        Timestamp updated = rs.getTimestamp("updatedAt");

        user.createdAt = created != null ? created.toLocalDateTime() : null;
        user.updatedAt = updated != null ? updated.toLocalDateTime() : null;

        return user;
    }
}
