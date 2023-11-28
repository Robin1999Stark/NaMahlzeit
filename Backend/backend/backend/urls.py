from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from foodplaner.views import (
    CreateMealWithIngredientsView, MealListView, MealDetailView,
    FoodPlanerItemView, FoodPlanerItemDetailView,
    IngredientListView, IngredientDetailView,
    MealIngredientListView, MealIngredientDetailView,
    InventoryItemListView, InventoryItemDetailView,
    InventoryListView, InventoryDetailView
)

router = routers.DefaultRouter()
router.register(r'meals', MealListView, basename='meal')
router.register(r'planer', FoodPlanerItemView, basename='foodplaneritem')
router.register(r'ingredients', IngredientListView, basename='ingredients')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('meals/<int:pk>/', MealDetailView.as_view(), name='meals-detail'),
    path('planer/<int:pk>/', FoodPlanerItemDetailView.as_view(),
         name='foodplaneritem-detail'),
    path('ingredients/<int:pk>/', IngredientDetailView.as_view(),
         name='ingredients-detail'),
    path('create-meal/', CreateMealWithIngredientsView.as_view(),
         name='create-meal-with-ingredients'),
    # Additional URLs for nested serialization
    path('meals/<int:meal_pk>/ingredients/',
         MealIngredientListView.as_view(), name='meals-ingredients-list'),
    path('meals/<int:meal_pk>/ingredients/<int:pk>/',
         MealIngredientDetailView.as_view(), name='meals-ingredients-detail'),

    path('inventory/<int:pk>/items/', InventoryItemListView.as_view(),
         name='inventory-items-list'),
    path('inventory/<int:pk>/items/<int:item_pk>/',
         InventoryItemDetailView.as_view(), name='inventory-items-detail'),
    path('inventory/<int:pk>/', InventoryDetailView.as_view(),
         name='inventory-detail'),
]
