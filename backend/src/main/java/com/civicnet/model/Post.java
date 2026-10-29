package com.civicnet.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "posts", indexes = @Index(name = "idx_posts_created", columnList = "createdAt"))
public class Post {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) private User author;
    @Column(nullable = false, length = 2000) private String content;
    private Instant createdAt = Instant.now();
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "post_likes", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "user_id")
    private Set<Long> likedBy = new HashSet<>();

    public Long getId() { return id; }
    public User getAuthor() { return author; }
    public void setAuthor(User a) { this.author = a; }
    public String getContent() { return content; }
    public void setContent(String c) { this.content = c; }
    public Instant getCreatedAt() { return createdAt; }
    public Set<Long> getLikedBy() { return likedBy; }
}
