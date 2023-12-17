from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from foodplaner.allviews import (
    MealListView,
    FoodPlanerItemView, FoodPlanerItemDetailView,
    IngredientListView, IngredientDetailView,
    MealIngredientListView, MealIngredientDetailView,
    MealIngredientListViewNormal,
    InventoryItemView, ShoppingListItemView,
    ShoppingListView, get_all_meals_on_planer,
    get_all_mealingredients_from_planer, is_planned,
)
from foodplaner.views.tag_views import TagListView, MealTagsListView, IngredientTagsListView

router = routers.DefaultRouter()
router.register(r'meals', MealListView, basename='meal')
router.register(r'planer', FoodPlanerItemView, basename='foodplaneritem')
router.register(r'ingredients', IngredientListView, basename='ingredients')
router.register(r'inventory', InventoryItemView, basename='inventory')
router.register(r'meal-ingredients', MealIngredientListViewNormal,
                basename='meal-ingredients')
router.register(r'shopping-lists', ShoppingListView, basename='shopping-lists')
router.register(r'shopping-list-items', ShoppingListItemView,
                basename='shopping-list-items')
router.register(r'tags', TagListView, basename='tags')
router.register(r'meal-tags', MealTagsListView, basename='meal-tags')
router.register(r'ingredient-tags', IngredientTagsListView,
                basename='ingredient-tags')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('planer/<int:pk>/', FoodPlanerItemDetailView.as_view(),
         name='foodplaneritem-detail'),
    path('get-all-meals-from-planer/', get_all_meals_on_planer,
         name='planer-get-all-meals'),
    path('is-planned/<int:meal_pk>/', is_planned, name='meal-is-planned'),
    path('get-all-ingredients-from-planer/', get_all_mealingredients_from_planer,
         name='planer-get-all-meals'),

    path('ingredients/<int:pk>/', IngredientDetailView.as_view(),
         name='ingredients-detail'),
    # Additional URLs for nested serialization
    path('meals/<int:meal_pk>/ingredients/',
         MealIngredientListView.as_view(), name='meals-ingredients-list'),
    path('meals/<int:meal_pk>/ingredients/<int:pk>/',
         MealIngredientDetailView.as_view(), name='meals-ingredients-detail'),
]
