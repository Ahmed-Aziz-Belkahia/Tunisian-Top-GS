from django import forms

from Courses.models import Course
from PrivateSessions.models import PrivateSession, PrivateSessionRequest
from Users.models import CustomUser, Professor


""" class PrivateSessionRequestForm(forms.ModelForm):
    selected_professor = forms.ChoiceField(label='Professor Selector', choices=PrivateSessionRequest.PROFESSOR_CHOICES)
    session_mode = forms.ChoiceField(label='Session Mode', choices=PrivateSessionRequest.TYPES, required=False)
    first_name = forms.CharField(label='First Name', max_length=50, required=False)
    last_name = forms.CharField(label='Last Name', max_length=50, required=False)
    email = forms.EmailField(label='Email', max_length=254, required=False)
    phone = forms.CharField(label='Phone Number', max_length=50, required=False)
    duration_hours = forms.ChoiceField(label='Duration Hours', choices=PrivateSessionRequest.DURATION_CHOICES, required=False)

    class Meta:
        model = PrivateSessionRequest
        fields = []  # empty fields as we have defined them explicitly """


class PrivateSessionForm(forms.ModelForm):
    duration = forms.ChoiceField(choices=PrivateSession.DURATION_CHOICES)

    class Meta:
        model = PrivateSession
        #fields = ['status', 'student', 'professor', 'cours', 'schedule', 'duration', 'first_name', 'last_name', 'email', 'phone_number', 'session_mode']
        fields = ['professor', 'cours', 'schedule', 'duration', 'first_name', 'last_name', 'email', 'phone_number', 'session_mode']

    def __init__(self, *args, **kwargs):
        super(PrivateSessionForm, self).__init__(*args, **kwargs)
        #self.fields['status'].widget = forms.Select(choices=PrivateSession.STATUS_CHOICES)
        #self.fields['student'].widget = forms.CheckboxSelectMultiple()
        #self.fields['student'].queryset = CustomUser.objects.all()
        #self.fields['student'].empty_label = None  # Remove empty label
        self.fields['professor'].queryset = Professor.objects.all()
        self.fields['professor'].empty_label = None  # Remove empty label
        self.fields['cours'].queryset = Course.objects.all()
        self.fields['cours'].empty_label = None  # Remove empty label
        self.fields['schedule'].widget = forms.DateTimeInput(attrs={'type': 'datetime-local'})