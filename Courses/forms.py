# Courses/forms.py

from django import forms
from .models import CourseOrder, Quiz, QuizOption

class QuizForm(forms.ModelForm):
    class Meta:
        model = Quiz
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Check if instance exists (editing an existing quiz)
        if self.instance.pk:
            self.fields['answer'].queryset = QuizOption.objects.filter(quiz=self.instance)
        else:
            # New instance, no associated quiz yet
            self.fields['answer'].queryset = QuizOption.objects.none()

