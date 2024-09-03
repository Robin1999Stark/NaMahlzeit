from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static
from foodplaner.views.tag_views import TagListView, MealTagsListView, IngredientTagsListView, export_tags, ingredients_by_tags, meals_by_tags
from foodplaner.views.planer_views import move_to_day, remove_meal_from_planer_item, FoodPlanerItemDetailView, FoodPlanerItemView
from foodplaner.views.meal_views import get_all_meals_on_planer, export_meals, get_all_mealingredients_from_planer, is_planned, MealListView, MealIngredientListView, MealIngredientDetailView, MealIngredientListViewNormal
from foodplaner.views.ingredient_views import IngredientDetailView, IngredientListView, export_ingredients
from foodplaner.views.shoppinglist_views import ShoppingListItemView, ShoppingListView
from foodplaner.views.inventory_views import InventoryItemView
from foodplaner.views.user_views import UserRegistrationViewSet, GetUserDataFromTokenView, GetUserView, UserLoginViewSet, UserLogoutViewSet, PasswordResetViewSet, PasswordResetConfirmViewSet, get_csrf_token


router = routers.DefaultRouter()
router.register(r'api/meals', MealListView, basename='meal')
router.register(r'api/planer', FoodPlanerItemView, basename='foodplaneritem')
router.register(r'api/ingredients', IngredientListView, basename='ingredients')
router.register(r'api/inventory', InventoryItemView, basename='inventory')
router.register(r'api/meal-ingredients', MealIngredientListViewNormal,
                basename='meal-ingredients')
router.register(r'api/shopping-lists', ShoppingListView,
                basename='shopping-lists')
router.register(r'api/shopping-list-items', ShoppingListItemView,
                basename='shopping-list-items')
router.register(r'api/tags', TagListView, basename='tags')
router.register(r'api/meal-tags', MealTagsListView, basename='meal-tags')
router.register(r'api/ingredient-tags', IngredientTagsListView,
                basename='ingredient-tags')

urlpatterns = [
    path('api/get_csrf_token', get_csrf_token, name='get_csrf_token'),
    path('api/users/register',
         UserRegistrationViewSet.as_view({'post': 'create'}), name='user-register'),
    path('api/users/login', UserLoginViewSet.as_view(), name='user-login'),
    path('api/users/logout', UserLogoutViewSet.as_view(), name='user-logout'),
    path('api/users/me', GetUserView.as_view(), name='get_user'),
    path('api/users/me-from-token', GetUserDataFromTokenView.as_view(),
         name='get_user_from_token'),
    path('api/users/password-reset',
         PasswordResetViewSet.as_view(), name='password-reset'),
    path('api/users/password_reset_confirm/<uidb64>/<token>',
         PasswordResetConfirmViewSet.as_view(), name='password_reset_confirm'),
    path('api/admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/planer/<int:pk>/', FoodPlanerItemDetailView.as_view(),
         name='foodplaneritem-detail'),
    path('api/planer/moveto/<str:to_planer>/<str:from_planer>/<int:meal_id>/', move_to_day,
         name='moveto'),
    path('api/planer/remove/<str:planer_date>/<int:meal_id>/', remove_meal_from_planer_item,
         name='moveto'),
    path('api/get-all-meals-from-planer/<str:start>/<str:end>/', get_all_meals_on_planer,
         name='planer-get-all-meals'),
    path('api/is-planned/<int:meal_pk>/', is_planned, name='meal-is-planned'),
    path('api/get-all-ingredients-from-planer/<str:start>/<str:end>/', get_all_mealingredients_from_planer,
         name='planer-get-all-ingredients_meal'),
    path('api/ingredients/<int:pk>/', IngredientDetailView.as_view(),
         name='ingredients-detail'),

    path('api/meals/<int:meal_pk>/ingredients/',
         MealIngredientListView.as_view(), name='meals-ingredients-list'),
    path('api/meals/<int:meal_pk>/ingredients/<int:pk>/',
         MealIngredientDetailView.as_view(), name='meals-ingredients-detail'),
    path('api/meals_by_tags/<str:tags>/', meals_by_tags, name='meals_by_tags'),
    path('api/ingredients_by_tags/<str:tags>/',
         ingredients_by_tags, name='ingredients_by_tags'),

    path('api/export/ingredients/', export_ingredients, name='export_ingredients'),
    path('api/export/meals/', export_meals, name='export_meals'),
    path('api/export/tags/', export_tags, name='export_tags'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
