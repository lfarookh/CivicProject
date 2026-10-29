package com.civicnet.web;

import com.civicnet.model.User;
import com.civicnet.repo.UserRepository;
import com.civicnet.security.JwtService;
import com.civicnet.web.Dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final UserRepository users; private final PasswordEncoder enc; private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder enc, JwtService jwt) {
        this.users = users; this.enc = enc; this.jwt = jwt;
    }

    @PostMapping("/auth/register")
    public AuthRes register(@Valid @RequestBody RegisterReq r) {
        if (users.existsByEmailIgnoreCase(r.email()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        User u = new User();
        u.setDisplayName(r.displayName().trim());
        u.setEmail(r.email().trim().toLowerCase());
        u.setPasswordHash(enc.encode(r.password()));
        u.setAccountType(r.accountType());
        users.save(u);
        return new AuthRes(jwt.issue(u.getId()), UserDto.of(u));
    }

    @PostMapping("/auth/login")
    public AuthRes login(@Valid @RequestBody LoginReq r) {
        User u = users.findByEmailIgnoreCase(r.email().trim())
                .filter(x -> enc.matches(r.password(), x.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect"));
        return new AuthRes(jwt.issue(u.getId()), UserDto.of(u));
    }

    @GetMapping("/me")
    public UserDto me(Authentication auth) {
        return users.findById((Long) auth.getPrincipal()).map(UserDto::of)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }
}
