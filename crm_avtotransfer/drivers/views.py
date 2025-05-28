from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Driver
from .serializers import (
    DriverSerializer,
    DriverCreateSerializer,
    DriverDetailSerializer,
    DriverStatusSerializer
)
from .filters import DriverFilter


class DriverViewSet(viewsets.ModelViewSet):
    """
    ViewSet для водіїв з підтримкою:
    - Фільтрації по статусу, типу ліцензії
    - Пошуку по імені та номеру ліцензії
    - Кастомних ендпоінтів для роботи з доступністю
    """
    queryset = Driver.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = DriverFilter
    search_fields = ['name', 'license_number']
    ordering_fields = ['hire_date', 'experience']
    ordering = ['-hire_date']

    def get_serializer_class(self):
        if self.action == 'create':
            return DriverCreateSerializer
        elif self.action == 'retrieve':
            return DriverDetailSerializer
        elif self.action in ['update_status', 'set_availability']:
            return DriverStatusSerializer
        return DriverSerializer

    @action(detail=False, methods=['get'])
    def list_available(self, request):
        """Кастомний ендпоінт для отримання доступних водіїв"""
        queryset = self.filter_queryset(self.get_queryset().filter(is_available=True))
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        """Оновлення статусу водія (активний/неактивний)"""
        driver = self.get_object()
        serializer = self.get_serializer(driver, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='set-availability')
    def set_availability(self, request, pk=None):
        """Зміна доступності водія для замовлень"""
        driver = self.get_object()
        driver.is_available = not driver.is_available
        driver.save()
        return Response(
            {'status': 'success', 'is_available': driver.is_available},
            status=status.HTTP_200_OK
        )

    def perform_destroy(self, instance):
        """М'яке видалення (зміна статусу замість реального видалення)"""
        instance.is_active = False
        instance.is_available = False
        instance.save()