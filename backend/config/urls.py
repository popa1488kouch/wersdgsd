from django.contrib import admin
from django.urls import path
from game.views import GameResultListCreate

urlpatterns = [
    path("admin/", admin.site.urls),
    path("game-results/", GameResultListCreate.as_view()),
]
