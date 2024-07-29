from django import forms
from .models import CustomUser, Transaction
from django.core.validators import RegexValidator, EmailValidator
from django.contrib.auth.models import User

class TransactionForm(forms.ModelForm):
    TYPE_CHOICES = [
        ('profit', 'Profit'),
        ('loss', 'Loss'),
    ]

    type = forms.ChoiceField(choices=TYPE_CHOICES)

    class Meta:
        model = Transaction
        fields = ['type', 'pair', 'amount', 'img', 'status']
        widgets = {
            'pair': forms.TextInput(attrs={'placeholder': 'e.g., BTC/USD'}),
            'amount': forms.NumberInput(attrs={'placeholder': 'e.g., 1000'}),
            'img': forms.ClearableFileInput(attrs={'placeholder': 'Upload your proof'}),
            'status': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

class OrderForm(forms.Form):
    first_name = forms.CharField(label="First Name", max_length=100)
    last_name = forms.CharField(label="Last Name", max_length=100)
    address = forms.CharField(label="Address", max_length=200)
    city = forms.CharField(label="City", max_length=100)
    state = forms.CharField(label="State", max_length=100)
    zip_code = forms.CharField(label="Zip Code", max_length=10)

class CustomUserForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(CustomUserForm, self).__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'edit-field'

    class Meta:
        model = CustomUser
        fields = ['email', 'tel', 'bio']
        labels = {
            'email': 'Email',
            'tel': 'Phone Number',
            'bio': 'Bio',
        }


# class UserUpdateForm(forms.ModelForm):
#     username = forms.CharField(max_length=150, required=True)
#     email = forms.EmailField(required=True)

#     class Meta:
#         model = CustomUser
#         fields = ['tel', 'bio']

#     def __init__(self, *args, **kwargs):
#         super(UserUpdateForm, self).__init__(*args, **kwargs)
#         self.fields['username'].initial = self.instance.user.username
#         self.fields['email'].initial = self.instance.user.email

#     def save(self, commit=True):
#         user = super(UserUpdateForm, self).save(commit=False)
#         user.user.username = self.cleaned_data['username']
#         user.user.email = self.cleaned_data['email']
#         if commit:
#             user.user.save()
#             user.save()
#         return user


class UpdateUserForm(forms.ModelForm):
    email = forms.EmailField(
        required=False,
        validators=[EmailValidator()]
    )
    tel = forms.CharField(
        required=False,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")]
    )

    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    username = forms.CharField(required=False)

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'tel', 'bio', 'username']

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if username and User.objects.filter(username=username).exclude(pk=self.user.pk).exists():
            raise forms.ValidationError("Username already taken.")
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email and User.objects.filter(email=email).exclude(pk=self.user.pk).exists():
            raise forms.ValidationError("Email already taken.")
        return email