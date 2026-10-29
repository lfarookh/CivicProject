package com.civicnet.repo;

import com.civicnet.model.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;

public interface PostRepository extends JpaRepository<Post, Long> {
    @EntityGraph(attributePaths = "author")
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable p);

    @EntityGraph(attributePaths = "author")
    Page<Post> findByAuthor_AccountTypeOrderByCreatedAtDesc(AccountType type, Pageable p);
}
