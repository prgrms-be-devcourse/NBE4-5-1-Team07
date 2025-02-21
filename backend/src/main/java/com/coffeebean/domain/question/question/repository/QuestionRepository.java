package com.coffeebean.domain.question.question.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coffeebean.domain.question.question.entity.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
}
