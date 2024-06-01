from django import forms
from .models import CustomUser, Transaction

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

class NotificationSettingsForm(forms.ModelForm):
    
    def __init__(self, *args, **kwargs):
        super(NotificationSettingsForm, self).__init__(*args, **kwargs)
        self.fields['p_general_n'].widget.attrs.update({
            'class': 'container_toggle',
            'name': 'mode',
            'type': 'checkbox',
            'id': 'switch-general'
        })
        self.fields['p_chat_n'].widget.attrs.update({
            'class': 'container_toggle',
            'name': 'mode',
            'type': 'checkbox',
            'id': 'switch-chat'
        })
        self.fields['p_courses_n'].widget.attrs.update({
            'class': 'container_toggle',
            'name': 'mode',
            'type': 'checkbox',
            'id': 'switch-courses'
        })
        self.fields['email_general_n'].widget.attrs.update({
            'class': 'container_toggle',
            'name': 'mode',
            'type': 'checkbox',
            'id': 'switch-email-general'
        })
        self.fields['email_chat_n'].widget.attrs.update({
            'class': 'container_toggle',
            'name': 'mode',
            'type': 'checkbox',
            'id': 'switch-email-chat'
        })
        self.fields['email_courses_n'].widget.attrs.update({
            'class': 'container_toggle',
            'name': 'mode',
            'type': 'checkbox',
            'id': 'switch-email-courses'
        })
    
    class Meta:
        model = CustomUser
        fields = [
            'p_general_n', 'p_chat_n', 'p_courses_n',
            'email_general_n', 'email_chat_n', 'email_courses_n'
        ]
class UserUpdateForm(forms.ModelForm):
    username = forms.CharField(max_length=150, required=True)
    email = forms.EmailField(required=True)

    class Meta:
        model = CustomUser
        fields = ['tel', 'bio']

    def __init__(self, *args, **kwargs):
        super(UserUpdateForm, self).__init__(*args, **kwargs)
        self.fields['username'].initial = self.instance.user.username
        self.fields['email'].initial = self.instance.user.email

    def save(self, commit=True):
        user = super(UserUpdateForm, self).save(commit=False)
        user.user.username = self.cleaned_data['username']
        user.user.email = self.cleaned_data['email']
        if commit:
            user.user.save()
            user.save()
        return user