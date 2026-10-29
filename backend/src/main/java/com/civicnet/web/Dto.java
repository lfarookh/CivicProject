package com.civicnet.web;

import com.civicnet.model.*;
import jakarta.validation.constraints.*;
import java.time.Instant;

public final class Dto {
    private Dto() {}
    public record RegisterReq(@NotBlank @Size(max = 120) String displayName, @Email @NotBlank String email,
                              @NotBlank @Size(min = 8, max = 100) String password, @NotNull AccountType accountType) {}
    public record LoginReq(@Email @NotBlank String email, @NotBlank String password) {}
    public record UserDto(Long id, String displayName, String email, AccountType accountType, boolean verified) {
        public static UserDto of(User u) { return new UserDto(u.getId(), u.getDisplayName(), u.getEmail(), u.getAccountType(), u.isVerified()); }
    }
    public record AuthRes(String token, UserDto user) {}
    public record PostReq(@NotBlank @Size(max = 2000) String content) {}
    public record PostDto(Long id, String content, Instant createdAt, UserDto author, int likes, boolean likedByMe) {
        public static PostDto of(Post p, Long me) {
            return new PostDto(p.getId(), p.getContent(), p.getCreatedAt(), UserDto.of(p.getAuthor()),
                    p.getLikedBy().size(), p.getLikedBy().contains(me));
        }
    }
}
