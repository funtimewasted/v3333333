// app.js

// app.js - modify the import section
import { subjectStructure } from './subjects.js';
import { englishQuestions } from './questions/english.js';
import { arabicQuestions } from './questions/arabic.js';
import { historyQuestions } from './questions/history.js';
import { islamicQuestions } from './questions/islamic.js';

// Add this after the imports
const questionBank = {
    english: englishQuestions,
    arabic: arabicQuestions,
    history: historyQuestions,
    islamic: islamicQuestions
};

class QuestionBankApp {
    constructor() {
        // DOM Elements
        this.subjectSelect = document.getElementById('subjectSelect');
        this.semesterSelect = document.getElementById('semesterSelect');
        this.unitSelect = document.getElementById('unitSelect');
        this.lessonSelect = document.getElementById('lessonSelect');
        this.questionArea = document.getElementById('questionArea');
        this.studyModeArea = document.getElementById('studyModeArea');
        this.questionContent = document.getElementById('questionContent');

        // State
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = null;

        // Bind event listeners
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Selection change handlers
        this.subjectSelect.addEventListener('change', () => this.handleSubjectChange());
        this.semesterSelect.addEventListener('change', () => this.handleSemesterChange());
        this.unitSelect.addEventListener('change', () => this.handleUnitChange());
        this.lessonSelect.addEventListener('change', () => this.handleLessonChange());

        // Question navigation
        document.getElementById('submitBtn').addEventListener('click', () => this.submitAnswer());
        document.getElementById('nextBtn').addEventListener('click', () => this.showNextQuestion());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartQuiz());

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterQuestions(e.target.dataset.type));
        });
    }

    handleSubjectChange() {
        const subject = this.subjectSelect.value;
        if (!subject) {
            this.resetSelects(['semester', 'unit', 'lesson']);
            return;
        }

        this.populateSemesterSelect(subject);
        this.semesterSelect.disabled = false;
        this.resetSelects(['unit', 'lesson']);
    }

    handleSemesterChange() {
        const subject = this.subjectSelect.value;
        const semester = this.semesterSelect.value;
        if (!semester) {
            this.resetSelects(['unit', 'lesson']);
            return;
        }

        this.populateUnitSelect(subject, semester);
        this.unitSelect.disabled = false;
        this.resetSelects(['lesson']);
    }

    handleUnitChange() {
        const subject = this.subjectSelect.value;
        const semester = this.semesterSelect.value;
        const unit = this.unitSelect.value;
        if (!unit) {
            this.resetSelects(['lesson']);
            return;
        }

        this.populateLessonSelect(subject, semester, unit);
        this.lessonSelect.disabled = false;
    }

    handleLessonChange() {
        const subject = this.subjectSelect.value;
        const semester = this.semesterSelect.value;
        const unit = this.unitSelect.value;
        const lesson = this.lessonSelect.value;

        if (!lesson) {
            this.hideQuestions();
            return;
        }

        this.loadQuestions(subject, semester, unit, lesson);
    }

    populateSemesterSelect(subject) {
        const semesters = Object.entries(subjectStructure[subject].semesters);
        this.semesterSelect.innerHTML = '<option value="">Select Semester</option>';
        semesters.forEach(([value, data]) => {
            this.semesterSelect.innerHTML += `<option value="${value}">${data.name}</option>`;
        });
    }

    populateUnitSelect(subject, semester) {
        const units = Object.entries(subjectStructure[subject].semesters[semester].units);
        this.unitSelect.innerHTML = '<option value="">Select Unit</option>';
        units.forEach(([value, data]) => {
            this.unitSelect.innerHTML += `<option value="${value}">${data.name}</option>`;
        });
    }

    populateLessonSelect(subject, semester, unit) {
        const lessons = subjectStructure[subject].semesters[semester].units[unit].lessons;
        this.lessonSelect.innerHTML = '<option value="">Select Lesson</option>';
        lessons.forEach(lesson => {
            this.lessonSelect.innerHTML += `<option value="${lesson}">${lesson}</option>`;
        });
    }

    loadQuestions(subject, semester, unit, lesson) {
        this.currentQuestions = questionBank[subject][semester][unit][lesson].questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = new Date();

        if (this.isStudyMode) {
            this.showStudyMode();
        } else {
            this.showQuestion();
        }
    }

    showQuestion() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        this.questionArea.classList.remove('hidden');
        this.studyModeArea.classList.add('hidden');

        document.getElementById('lessonTitle').textContent = this.lessonSelect.value;
        document.getElementById('questionCounter').textContent = 
            `Question ${this.currentQuestionIndex + 1} of ${this.currentQuestions.length}`;

        const questionContent = document.getElementById('questionContent');
        questionContent.innerHTML = this.createQuestionHTML(question);
    }

    createQuestionHTML(question) {
        let html = `
            <div class="question-card">
                <p class="question-text">${question.question}</p>
                <div class="answer-options">
        `;

        switch (question.type) {
            case 'multiple':
                html += question.options.map((option, index) => `
                    <label class="answer-option">
                        <input type="radio" name="answer" value="${index}">
                        ${option}
                    </label>
                `).join('');
                break;

            case 'true-false':
                html += `
                    <label class="answer-option">
                        <input type="radio" name="answer" value="true"> True
                    </label>
                    <label class="answer-option">
                        <input type="radio" name="answer" value="false"> False
                    </label>
                `;
                break;

            case 'short':
                html += `
                    <textarea class="short-answer" rows="4" placeholder="Type your answer here..."></textarea>
                `;
                break;
        }

        html += `
                </div>
                <div id="feedback" class="feedback hidden"></div>
                <div class="button-group">
                    <button id="submitBtn" class="btn primary">Submit Answer</button>
                    <button id="nextBtn" class="btn secondary hidden">Next Question</button>
                </div>
            </div>
        `;

        return html;
    }

        let html = '<div class="study-content">';
        this.currentQuestions.forEach((question, index) => {
            html += `
                <div class="study-card">
                    <h3>Question ${index + 1}</h3>
                    <p class="question-text">${question.question}</p>
                    <div class="study-answer">
                        <h4>Answer:</h4>
                        ${this.getAnswerHTML(question)}
                        <div class="explanation">
                            <h4>Explanation:</h4>
                            <p>${question.explanation}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        this.studyModeArea.innerHTML = html;
    }

    getAnswerHTML(question) {
        switch (question.type) {
            case 'multiple':
                return `<p>${question.options[question.correctAnswer]}</p>`;
            case 'true-false':
                return `<p>${question.correctAnswer ? 'True' : 'False'}</p>`;
            case 'short':
                return `<p>${question.sampleAnswer}</p>`;
            default:
                return '';
        }
    }

    submitAnswer() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const feedback = document.getElementById('feedback');
        const submitBtn = document.getElementById('submitBtn');
        const nextBtn = document.getElementById('nextBtn');
        let isCorrect = false;

        switch (question.type) {
            case 'multiple':
            case 'true-false':
                const selectedAnswer = document.querySelector('input[name="answer"]:checked');
                if (!selectedAnswer) {
                    feedback.textContent = 'Please select an answer.';
                    feedback.className = 'feedback incorrect';
                    feedback.classList.remove('hidden');
                    return;
                }
                isCorrect = this.checkAnswer(selectedAnswer.value, question);
                break;

            case 'short':
                const answer = document.querySelector('.short-answer').value.trim();
                if (!answer) {
                    feedback.textContent = 'Please enter an answer.';
                    feedback.className = 'feedback incorrect';
                    feedback.classList.remove('hidden');
                    return;
                }
                feedback.innerHTML = `
                    <h4>Sample Answer:</h4>
                    <p>${question.sampleAnswer}</p>
                    <p class="mt-2">Compare your answer with the sample answer above.</p>
                `;
                feedback.className = 'feedback';
                break;
        }

        feedback.classList.remove('hidden');
        submitBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');

        if (question.type !== 'short') {
            feedback.innerHTML = `
                <p>${isCorrect ? 'Correct!' : 'Incorrect.'}</p>
                <p>${question.explanation}</p>
            `;
            feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
            if (isCorrect) this.score++;
        }
    }

    checkAnswer(answer, question) {
        switch (question.type) {
            case 'multiple':
                return parseInt(answer) === question.correctAnswer;
            case 'true-false':
                return answer === question.correctAnswer.toString();
            default:
                return false;
        }
    }

    showNextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.currentQuestions.length) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        const endTime = new Date();
        const timeSpent = Math.floor((endTime - this.startTime) / 1000);
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;

        document.getElementById('questionArea').classList.add('hidden');
        document.getElementById('resultsArea').classList.remove('hidden');
        
        document.getElementById('finalScore').textContent = 
            `${Math.round((this.score / this.currentQuestions.length) * 100)}%`;
        document.getElementById('correctAnswers').textContent = this.score;
        document.getElementById('incorrectAnswers').textContent = 
            this.currentQuestions.length - this.score;
        document.getElementById('timeSpent').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    toggleStudyMode() {
        this.isStudyMode = this.modeToggle.checked;
        if (this.currentQuestions.length > 0) {
            if (this.isStudyMode) {
                this.showStudyMode();
            } else {
                this.currentQuestionIndex = 0;
                this.score = 0;
                this.showQuestion();
            }
        }
    }

    filterQuestions(type) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });

        if (type === 'all') {
            this.currentQuestions = questionBank[this.subjectSelect.value]
                [this.semesterSelect.value]
                [this.unitSelect.value]
                [this.lessonSelect.value].questions;
        } else {
            this.currentQuestions = questionBank[this.subjectSelect.value]
                [this.semesterSelect.value]
                [this.unitSelect.value]
                [this.lessonSelect.value].questions
                .filter(q => q.type === type);
        }

        this.currentQuestionIndex = 0;
        this.score = 0;
        if (this.currentQuestions.length > 0) {
            if (this.isStudyMode) {
                this.showStudyMode();
            } else {
                this.showQuestion();
            }
        }
    }

    resetSelects(selects) {
        selects.forEach(select => {
            const element = document.getElementById(`${select}Select`);
            element.innerHTML = `<option value="">Select ${select.charAt(0).toUpperCase() + select.slice(1)}</option>`;
            element.disabled = true;
        });
        this.hideQuestions();
    }

    hideQuestions() {
        this.questionArea.classList.add('hidden');
        this.studyModeArea.classList.add('hidden');
        document.getElementById('resultsArea').classList.add('hidden');
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = new Date();
        document.getElementById('resultsArea').classList.add('hidden');
        this.showQuestion();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new QuestionBankApp();
});
