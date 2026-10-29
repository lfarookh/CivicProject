package com.civicnet.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 120) private String displayName;
    @Column(nullable = false, unique = true, length = 190) private String email;
    @Column(nullable = false) private String passwordHash;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private AccountType accountType;
    /** Set by an administrator after checking government/organization credentials. */
    private boolean verified = false;
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String v) { this.displayName = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String v) { this.passwordHash = v; }
    public AccountType getAccountType() { return accountType; }
    public void setAccountType(AccountType v) { this.accountType = v; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean v) { this.verified = v; }
    public Instant getCreatedAt() { return createdAt; }
}
