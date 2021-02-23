from django.urls import path
from .views import *

urlpatterns = [
    path('todo/list/', todoList),
    path('todo/detail/<int:id>', todoDetail)
]
