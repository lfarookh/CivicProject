package com.civicnet.web;

import com.civicnet.model.*;
import com.civicnet.repo.*;
import com.civicnet.web.Dto.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class FeedController {
    private final PostRepository posts; private final UserRepository users;

    public FeedController(PostRepository posts, UserRepository users) { this.posts = posts; this.users = users; }

    /** Network feed, newest first. Optional filter by account type. */
    @GetMapping("/feed")
    @Transactional(readOnly = true)
    public List<PostDto> feed(Authentication auth, @RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "20") int size,
                              @RequestParam(required = false) AccountType type) {
        Long me = (Long) auth.getPrincipal();
        Pageable p = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50));
        Page<Post> result = type == null ? posts.findAllByOrderByCreatedAtDesc(p)
                : posts.findByAuthor_AccountTypeOrderByCreatedAtDesc(type, p);
        return result.stream().map(x -> PostDto.of(x, me)).toList();
    }

    @PostMapping("/posts")
    @Transactional
    public PostDto create(Authentication auth, @Valid @RequestBody PostReq r) {
        Long me = (Long) auth.getPrincipal();
        Post p = new Post();
        p.setAuthor(users.getReferenceById(me));
        p.setContent(r.content().trim());
        posts.save(p);
        return PostDto.of(posts.findById(p.getId()).orElseThrow(), me);
    }

    @PostMapping("/posts/{id}/like")
    @Transactional
    public PostDto toggleLike(Authentication auth, @PathVariable Long id) {
        Long me = (Long) auth.getPrincipal();
        Post p = posts.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!p.getLikedBy().remove(me)) p.getLikedBy().add(me);
        return PostDto.of(p, me);
    }
}
