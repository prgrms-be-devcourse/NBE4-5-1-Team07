package com.coffeebean.domain.question.question.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coffeebean.domain.question.question.entity.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

	@EntityGraph(attributePaths = {"author", "answer"})
	Optional<Question> findById(Long id);

	@EntityGraph(attributePaths = {"author", "answer"})
	List<Question> findAll();
}
