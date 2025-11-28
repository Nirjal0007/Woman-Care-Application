package com.example.women.health.controller;

import com.example.women.health.model.User;
import com.example.women.health.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController implements WebMvcConfigurer {

    private final UserService userService;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ Serve uploaded images
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + UPLOAD_DIR);
    }

    // ✅ Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAll());
    }

    // ✅ Add new user
    @PostMapping
    public ResponseEntity<?> addUser(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.add(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid user data: " + e.getMessage());
        }
    }

    // ✅ Get user by username
    @GetMapping("/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        User foundUser = userService.getByUsername(username);
        if (foundUser != null) return ResponseEntity.ok(foundUser);
        return ResponseEntity.status(404).body("User not found with username: " + username);
    }

    // ✅ Update name/bio
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            User existingUser = userService.getById(id);
            if (existingUser == null)
                return ResponseEntity.status(404).body("User not found with id: " + id);

            existingUser.setName(updatedUser.getName());
            existingUser.setBio(updatedUser.getBio());
            User saved = userService.add(existingUser);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating user: " + e.getMessage());
        }
    }

    // ✅ Upload avatar
    @PostMapping("/upload-avatar/{id}")
    public ResponseEntity<?> uploadAvatar(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            User user = userService.getById(id);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }

            // Ensure upload folder exists
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Unique filename to prevent overwriting
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path targetPath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Update DB
            user.setAvatar(fileName);
            userService.add(user);

            return ResponseEntity.ok(Map.of(
                    "message", "Avatar uploaded successfully",
                    "avatar", fileName
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to save file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
