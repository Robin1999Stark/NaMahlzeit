from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from foodplaner.allviews import (
    MealListView,
    IngredientListView, IngredientDetailView,
    MealIngredientListView, MealIngredientDetailView,
    MealIngredientListViewNormal,
    InventoryItemView, ShoppingListItemView,
    ShoppingListView, get_all_meals_on_planer,
    get_all_mealingredients_from_planer, is_planned,
)
from foodplaner.views.tag_views import TagListView, MealTagsListView, IngredientTagsListView, ingredients_by_tags, meals_by_tags
from foodplaner.views.planer_views import move_to_day, remove_meal_from_planer_item, FoodPlanerItemDetailView, FoodPlanerItemView


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
    path('planer/moveto/<str:to_planer>/<str:from_planer>/<int:meal_id>/', move_to_day,
         name='moveto'),
    path('planer/remove/<str:planer_date>/<int:meal_id>/', remove_meal_from_planer_item,
         name='moveto'),
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
    path('meals_by_tags/<str:tags>/', meals_by_tags, name='meals_by_tags'),
    path('ingredients_by_tags/<str:tags>/',
         ingredients_by_tags, name='ingredients_by_tags'),

]
