from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.utils import timezone
from foodplaner.models import Meal, Ingredient, FoodPlanerItem, MealIngredient, ShoppingListItem, ShoppingList
from django.contrib.auth import get_user_model

User = get_user_model()

class MealViewsTest(APITestCase):
    def setUp(self):
        # Erstellen eines Benutzers
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.force_authenticate(user=self.user)
        
        # Erstellen von Ingredients
        self.ingredient1 = Ingredient.objects.create(title='Tomato', description='A red fruit', preferedUnit='kg')
        self.ingredient2 = Ingredient.objects.create(title='Cheese', description='Dairy product', preferedUnit='g')

        # Erstellen von Meals
        self.meal = Meal.objects.create(
            title='Pizza', 
            description='Delicious cheese pizza', 
            duration=30, 
            portion_size=4
        )
        self.meal.ingredients.add(self.ingredient1, self.ingredient2)
        
        # Erstellen von FoodPlanerItem
        self.food_planer_item = FoodPlanerItem.objects.create(date=timezone.now())
        self.food_planer_item.meals.add(self.meal)

    def test_export_meals(self):
        url = reverse('export_meals')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Pizza', response.data[0]['title'])

    def test_get_all_mealingredients_from_planer(self):
        start_date = timezone.now().date()
        end_date = (timezone.now() + timezone.timedelta(days=1)).date()
        url = reverse('planer-get-all-ingredients_meal', kwargs={'start': start_date, 'end': end_date})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.ingredient1.title, [ingredient['title'] for ingredient in response.data])

    def test_get_all_meals_on_planer(self):
        start_date = timezone.now().date()
        end_date = (timezone.now() + timezone.timedelta(days=1)).date()
        url = reverse('planer-get-all-meals', kwargs={'start': start_date, 'end': end_date})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.meal.title, [meal['title'] for meal in response.data])

    def test_is_planned(self):
        url = reverse('meal-is-planned', kwargs={'meal_pk': self.meal.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['planned'], True)

    def test_meal_ingredient_list(self):
        url = reverse('meals-ingredients-list', kwargs={'meal_pk': self.meal.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.ingredient1.title, [ingredient['title'] for ingredient in response.data])

    def test_create_meal(self):
        url = reverse('meal-list')
        data = {
            'title': 'Salad',
            'description': 'Fresh vegetable salad',
            'duration': 15,
            'portion_size': 2,
            'ingredients': [
                {'title': self.ingredient1.title, 'amount': '1', 'unit': 'kg'}
            ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Meal.objects.count(), 2)

    def test_update_meal(self):
        url = reverse('meal-detail', kwargs={'pk': self.meal.id})
        data = {'title': 'Updated Pizza', 'description': 'Updated description'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.meal.refresh_from_db()
        self.assertEqual(self.meal.title, 'Updated Pizza')

