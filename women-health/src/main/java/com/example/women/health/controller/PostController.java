package com.example.women.health.controller;

import com.example.women.health.model.Comment;
import com.example.women.health.model.Post;
import com.example.women.health.service.CommentService;
import com.example.women.health.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    public PostController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    // 🚀 GET ALL POSTS + ATTACH COMMENTS
    @GetMapping
    public List<Post> getAll() {
        List<Post> posts = postService.getAll();
        for (Post p : posts) {
            p.setComments(commentService.getCommentsByPostId(p.getId()));
        }
        return posts;
    }

    // 🚀 GET POST BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getById(@PathVariable Long id) {
        Post post = postService.getById(id);
        if (post == null) return ResponseEntity.notFound().build();
        post.setComments(commentService.getCommentsByPostId(id));
        return ResponseEntity.ok(post);
    }

    // 🚀 ADD POST WITH IMAGE (MAIN FIX)
    @PostMapping("/add-with-image")
    public ResponseEntity<Post> addWithImage(
            @RequestParam("title") String title,
            @RequestParam("body") String body,
            @RequestParam("authorId") Long authorId,
            @RequestParam("authorName") String authorName,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            Post post = new Post();
            post.setTitle(title);
            post.setBody(body);
            post.setAuthorId(authorId);
            post.setAuthorName(authorName);
            post.setCreatedAt(System.currentTimeMillis());

            // Save image if exists
            if (image != null && !image.isEmpty()) {
                String folder = "uploads/";
                Files.createDirectories(Paths.get(folder));

                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path path = Paths.get(folder + fileName);

                Files.write(path, image.getBytes());
                post.setImage(fileName);
            }

            Post saved = postService.add(post);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 🚀 UPDATE POST (likes, favs, edit content)
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post updated) {
        Post existing = postService.getById(id);
        if (existing == null) return ResponseEntity.notFound().build();

        existing.setTitle(updated.getTitle());
        existing.setBody(updated.getBody());
        existing.setLikes(updated.getLikes());
        existing.setFavs(updated.getFavs());

        Post saved = postService.add(existing);
        return ResponseEntity.ok(saved);
    }

    // 🚀 DELETE POST
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!postService.existsById(id)) return ResponseEntity.notFound().build();
        postService.delete(id);
        return ResponseEntity.ok().build();
    }

    // 🚀 ADD COMMENT
    @PostMapping("/{postId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long postId,
            @RequestBody Comment comment
    ) {
        comment.setPostId(postId);
        Comment saved = commentService.add(comment);
        return ResponseEntity.ok(saved);
    }

    // 🚀 DELETE COMMENT
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.delete(commentId);
        return ResponseEntity.ok().build();
    }
}
