package com.example.women.health.repository;

import com.example.women.health.model.Cycle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CycleRepository extends JpaRepository<Cycle, Long> {
    List<Cycle> findByUserId(Long userId);
}
