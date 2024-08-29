from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.urls import reverse
from ..serializers.user_serializers import CustomUserCreationSerializer
from ..forms.user_forms import CustomUserCreationForm
from rest_framework.authtoken.models import Token
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from ..models import CustomUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth import get_user_model


def get_csrf_token(request):
    csrf_token = get_token(request)
    print(csrf_token)
    return JsonResponse({'csrfToken': csrf_token})


@csrf_exempt
def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})


def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = authenticate(
                username=form.cleaned_data['username'], password=form.cleaned_data['password'])
            if user is not None:
                login(request, user)
                return redirect('dashboard')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})


def user_logout(request):
    logout(request)
    return redirect('login')

# Create your views here.


class UserRegistrationViewSet(ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = CustomUserCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginViewSet(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            if user.is_active:
                login(request, user)
                token, _ = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'User account is disabled.'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)


class UserLogoutViewSet(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)


class PasswordResetViewSet(PasswordResetView):
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('password_reset_done')

    def get_template_names(self):
        return ['users/password_reset_form.html']


class PasswordResetConfirmViewSet(PasswordResetConfirmView):
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('password_reset_complete')

    def get_template_names(self):
        return ['users/password_reset_confirm_form.html']


class GetUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        user = request.user
        data = {
            "username": user.username,
            "birthday": user.birthday,
            "email": user.email,
            "profile_picture": user.profilepicture.url if user.profilepicture else None,
            "groups": [group.name for group in user.groups.all()],
            "permissions": [perm.codename for perm in user.user_permissions.all()],
            "date_joined": user.date_joined,
            "last_login": user.last_login,
        }

        return Response(data)


CustomUser = get_user_model()


class GetUserDataFromTokenView(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        # Get the token from the Authorization header
        print('start of evaluation')
        print(request)
        auth_header = request.headers.get('Authorization', None)
        print(auth_header)
        if not auth_header:
            return Response({'detail': 'Authorization header is missing.'}, status=status.HTTP_400_BAD_REQUEST)

        # Extract the token
        # Decode the token to get the user information
        try:
            token = auth_header.split(' ')[1]  # Expecting 'Bearer <token>'
            print("Extracted Token:", token)  # Print the extracted token

            UntypedToken(token)  # Verify the token
            payload = api_settings.TOKEN_TYPE_CLAIM_HANDLER(
                token)  # Decode the token
            print("Decoded Payload:", payload)
            username = payload.get('user_id')
            user = CustomUser.objects.get(username=username)
        except (InvalidToken, CustomUser.DoesNotExist):
            return Response({'detail': 'Invalid token or user does not exist.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Prepare user d

        data = {
            "username": user.username,
            "birthday": getattr(user, 'birthday', None),
            "email": user.email,
            "profile_picture": user.profilepicture.url if user.profilepicture else None,
            "groups": [group.name for group in user.groups.all()],
            "permissions": [perm.codename for perm in user.user_permissions.all()],
            "date_joined": user.date_joined,
            "last_login": user.last_login,
        }

        return Response(data)
