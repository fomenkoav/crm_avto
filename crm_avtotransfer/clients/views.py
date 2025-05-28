from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Client
from .serializers import (
    ClientSerializer,
    ClientCreateSerializer,
    ClientDetailSerializer,
    ClientLicenseUpdateSerializer
)
from .filters import ClientFilter


class ClientViewSet(viewsets.ModelViewSet):
    """
    ViewSet для клієнтів з підтримкою:
    - Фільтрації по телефону, email, типу документа
    - Пошуку по імені та номеру документа
    - Кастомних ендпоінтів для роботи з ліцензіями
    """
    queryset = Client.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ClientFilter
    search_fields = ['name', 'license_number']
    ordering_fields = ['registration_date', 'name']
    ordering = ['-registration_date']

    def get_serializer_class(self):
        if self.action == 'create':
            return ClientCreateSerializer
        elif self.action == 'retrieve':
            return ClientDetailSerializer
        elif self.action == 'update_license':
            return ClientLicenseUpdateSerializer
        return ClientSerializer

    @action(detail=True, methods=['patch'], url_path='update-license')
    def update_license(self, request, pk=None):
        """Кастомний ендпоінт для оновлення даних документа"""
        client = self.get_object()
        serializer = self.get_serializer(client, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='active')
    def active_clients(self, request):
        """Ендпоінт для отримання активних клієнтів"""
        queryset = self.filter_queryset(self.get_queryset().filter(is_active=True))
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """Деактивація клієнта замість видалення"""
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def list(self, request, *args, **kwargs):
        print("Поточний користувач:", request.user)  # Перевірка авторизації
        print("Запит до клієнтів:", self.get_queryset().query)  # SQL-запит
        return super().list(request, *args, **kwargs)
