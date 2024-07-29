from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from allauth.account.forms import SignupForm as AllauthSignupForm

from Users.models import CustomUser

from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import ContactSubmission, CustomUser

class customSignupForm(AllauthSignupForm):
    first_name = forms.CharField(
        max_length=100, 
        widget=forms.TextInput(attrs={'placeholder': 'First Name', 'id': "registerFirstname"})
    )
    last_name = forms.CharField(
        max_length=100, 
        widget=forms.TextInput(attrs={'placeholder': 'Last Name', 'id': "registerLastname"})
    )
    username = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={'placeholder': 'Username', 'id': "registerUsername"})
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'placeholder': 'Email', 'id': "registerEmail"})
    )
    password1 = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(attrs={'placeholder': 'Password', 'id': "registerPassword1"}),
        help_text="Your password can't be too similar to your other personal information. It must contain at least 8 characters, can't be a commonly used password, and can't be entirely numeric."
    )
    password2 = forms.CharField(
        label="Confirm Password",
        widget=forms.PasswordInput(attrs={'placeholder': 'Repeat password', 'id': "registerPassword2"}),
        strip=False,
        help_text="Enter the same password as before, for verification."
    )

    class Meta:
        model = CustomUser
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')

    def save(self, request):
        user = super(customSignupForm, self).save(request)
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()
        return user

class LogInForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Email or Username', 'id': 'loginUsername'}))
    password = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(attrs={'placeholder': 'Password', 'id': 'loginPassword'}),
    )

class RequestNewEmailForm(forms.Form):
    pass

class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactSubmission
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'subject', 'message']