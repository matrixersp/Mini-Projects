package com.matrixersp.quizapp;

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    private static final int MAX_CHOICES = 3;
    private static final int ANIMATION_DURATION = 700;

    private int questionsIndex = 0;
    private String[] questions = {
            "Who created Linux?",
            "When was java created?",
            "Who wrote Node.js",
            "What's the first programming language"
    };

    private String[][] answers = {
            {"Bill Gates", "Linus Torvalds", "Steve Jobs"},
            {"1834", "1991", "2000"},
            {"Rasmus Lerdorf", "Evan You", "Ryan Dahl"},
            {"FORTRAN", "C", "B"}
    };

    private String[] rightAnswers = {"Linus Torvalds", "1991", "Ryan Dahl", "FORTRAN"};
    private int score = 0;

    RelativeLayout containerLayout;
    LinearLayout quizLayout, resultLayout;
    RadioGroup radioGroup;
    TextView questionView;
    Button next;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        containerLayout = (RelativeLayout) findViewById(R.id.container_layout);
        quizLayout = (LinearLayout) findViewById(R.id.quiz_layout);
        setQuestion();
    }

    public void showNextQuiz(View view) {
        questionsIndex++;

        if(questionsIndex <= MAX_CHOICES) {
            animate();
            changeQuestion();
            calculateScore();
            if(questionsIndex == MAX_CHOICES) {
                ((Button) view).setText("Result");
            }
        } else {
            calculateScore();
            showResult();
        }

    }

    public void animate() {
        ObjectAnimator fadeOut = ObjectAnimator.ofFloat(quizLayout, "alpha",  1f, .1f);
        fadeOut.setDuration(ANIMATION_DURATION);
        ObjectAnimator fadeIn = ObjectAnimator.ofFloat(quizLayout, "alpha", .1f, 1f);
        fadeIn.setDuration(ANIMATION_DURATION);

        final AnimatorSet mAnimationSet = new AnimatorSet();

        mAnimationSet.play(fadeIn).after(fadeOut);
        mAnimationSet.start();
    }

    public void changeQuestion() {
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                setQuestion();
            }
        }, ANIMATION_DURATION);
    }

    public void setQuestion() {
        ((TextView) findViewById(R.id.question_count)).setText((questionsIndex + 1) + "/" + (MAX_CHOICES + 1));
        questionView = (TextView) findViewById(R.id.question_view);
        questionView.setText(questions[questionsIndex]);

        radioGroup = (RadioGroup) findViewById(R.id.radio_group);

        for(int i = 0; i < MAX_CHOICES; i++) {
            ((RadioButton) radioGroup.getChildAt(i)).setText(answers[questionsIndex][i]);
        }
    }

    public void calculateScore() {
        int checkedRadioButtonId = radioGroup.getCheckedRadioButtonId();

        if(checkedRadioButtonId > -1) {
            RadioButton checkedRadioButton = (RadioButton) findViewById(checkedRadioButtonId);

            String checkedAnswerText = checkedRadioButton.getText().toString();

            if(checkedAnswerText.equalsIgnoreCase(rightAnswers[questionsIndex - 1])) {
                score++;
            }
            radioGroup.clearCheck();
        }
        Toast.makeText(this, String.valueOf(score) + " questionsIndex: " + String.valueOf(questionsIndex), Toast.LENGTH_SHORT).show();
    }

    public void showResult() {
        //quizLayout.setVisibility(View.INVISIBLE);

        resultLayout = findViewById(R.id.result_layout);
        resultLayout.setVisibility(View.VISIBLE);

        int marginLeft = (containerLayout.getWidth() / 2) - (resultLayout.getWidth() / 2);
        int marginTop = (containerLayout.getHeight() / 2) - (resultLayout.getHeight() / 2);

        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);

        params.setMargins(marginLeft,marginTop, 0,0);
        resultLayout.setLayoutParams(params);

        String message = "";
        if(score == 0) {
            message = "Unfortunately! you got: " + score + "/" + (MAX_CHOICES + 1);
        } else if(score <= (MAX_CHOICES / 2)) {
            message = "You could do better! You got: " + score + "/" + (MAX_CHOICES + 1);
        } else if(score > (MAX_CHOICES / 2)){
            message = "Good job! You got: " + score + "/" + (MAX_CHOICES + 1);
        } else if(score == MAX_CHOICES) {
            message = "Perfect! You got: " + score + "/" + (MAX_CHOICES + 1);
        }

        ((TextView) findViewById(R.id.result_view)).setText(message);

        questionsIndex = 0;
        score = 0;
        disableQuiz();
    }

    public void disableQuiz() {
        ((Button) findViewById(R.id.btn_next)).setEnabled(false);
        for(int i = 0; i < radioGroup.getChildCount(); i++) {
            radioGroup.getChildAt(i).setEnabled(false);
        }
    }

    public void enableQuiz() {
        ((Button) findViewById(R.id.btn_next)).setEnabled(true);
        for(int i = 0; i < radioGroup.getChildCount(); i++) {
            radioGroup.getChildAt(i).setEnabled(true);
        }
    }

    public void playAgain(View view) {
        resultLayout.setVisibility(View.INVISIBLE);

        ((Button) findViewById(R.id.btn_next)).setText("Next");

        animate();
        enableQuiz();
        setQuestion();
    }
}
