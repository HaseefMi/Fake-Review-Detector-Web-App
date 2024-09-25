from django.urls import path
from . import views
urlpatterns = [
    path('send-data', views.recieve_input, name='recieve_input'),
]

