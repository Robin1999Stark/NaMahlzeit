from importlib import import_module

from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient


class SessionAuthenticationTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="session-user", password="test-password", email="session@example.com"
        )
        self.client = APIClient(enforce_csrf_checks=True)

    def login(self):
        response = self.client.get(reverse("get_csrf_token"))
        return self.client.post(
            reverse("user-login"),
            {"username": self.user.username, "password": "test-password"},
            HTTP_X_CSRFTOKEN=response.json()["csrfToken"],
        )

    def test_session_restores_user_in_new_client_without_api_token(self):
        self.assertEqual(self.login().status_code, 200)
        cookie = self.client.cookies[settings.SESSION_COOKIE_NAME]
        self.assertTrue(cookie["httponly"])
        self.assertEqual(int(cookie["max-age"]), settings.SESSION_COOKIE_AGE)

        reloaded_client = APIClient(enforce_csrf_checks=True)
        reloaded_client.cookies[settings.SESSION_COOKIE_NAME] = cookie.value
        response = reloaded_client.get(reverse("get_user"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["username"], self.user.username)

    def test_missing_or_expired_session_is_rejected(self):
        self.assertEqual(self.client.get(reverse("get_user")).status_code, 401)
        self.assertEqual(self.login().status_code, 200)
        session_key = self.client.cookies[settings.SESSION_COOKIE_NAME].value
        store = import_module(settings.SESSION_ENGINE).SessionStore
        store(session_key=session_key).delete()
        self.assertEqual(self.client.get(reverse("get_user")).status_code, 401)

    def test_logout_invalidates_existing_session(self):
        self.assertEqual(self.login().status_code, 200)
        old_cookie = self.client.cookies[settings.SESSION_COOKIE_NAME].value
        csrf_token = self.client.get(reverse("get_csrf_token")).json()["csrfToken"]
        response = self.client.post(
            reverse("user-logout"), HTTP_X_CSRFTOKEN=csrf_token
        )
        self.assertEqual(response.status_code, 200)
        reloaded_client = APIClient()
        reloaded_client.cookies[settings.SESSION_COOKIE_NAME] = old_cookie
        self.assertEqual(reloaded_client.get(reverse("get_user")).status_code, 401)

    def test_login_requires_csrf_token(self):
        response = self.client.post(
            reverse("user-login"),
            {"username": self.user.username, "password": "test-password"},
        )
        self.assertEqual(response.status_code, 403)

    def test_invalid_password_does_not_create_session(self):
        csrf_token = self.client.get(reverse("get_csrf_token")).json()["csrfToken"]
        response = self.client.post(
            reverse("user-login"),
            {"username": self.user.username, "password": "incorrect"},
            HTTP_X_CSRFTOKEN=csrf_token,
        )
        self.assertEqual(response.status_code, 401)
        self.assertNotIn(settings.SESSION_COOKIE_NAME, self.client.cookies)
