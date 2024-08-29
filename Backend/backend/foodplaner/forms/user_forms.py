from django import forms
from django.contrib.auth.forms import UserCreationForm, PasswordResetForm, UserChangeForm
from django.contrib.auth.models import User


class CustomUserCreationForm(UserCreationForm):
    firstname = forms.CharField()
    lastname = forms.CharField()
    birthday = forms.DateField()
    profilepicture = forms.ImageField(required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2',
                  'firstname', 'lastname', 'birthday', 'profilepicture']


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ['username', 'email']


class CustomPasswordResetForm(PasswordResetForm):
    # Customize the form fields or validation here if needed
    pass
