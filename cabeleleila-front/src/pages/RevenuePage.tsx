import { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import dayjs from 'dayjs';
import api from '../api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RevenuePage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [revenue, setRevenue] = useState<number | null>(null);
  const [revenueData, setRevenueData] = useState<any>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const fetchRevenue = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', `${startDate}T00:00:00`);
      if (endDate) params.append('endDate', `${endDate}T23:59:59`);

      const res = await api.get(`/bookings/revenue?${params.toString()}`);
      console.log('API Response:', res.data); // Log da resposta da API

      // Verificar se a resposta é um número
      if (typeof res.data === 'number') {
        setRevenue(res.data);
        setRevenueData([res.data]);  // Se for um número, insira-o no array para gráficos
        setLabels(['Faturamento Total']); // Nome do único label (total)
      } else if (Array.isArray(res.data)) {
        // Se for um array, continue como antes
        const labels = res.data.map((item: any) => dayjs(item.date).format('DD/MM/YYYY'));
        const revenues = res.data.map((item: any) => item.revenue);

        setLabels(labels);
        setRevenueData(revenues);
        setRevenue(res.data.reduce((acc: number, item: any) => acc + item.revenue, 0));
      } else {
        console.error('Formato de resposta inesperado:', res.data);
      }
    } catch (err) {
      console.error('Erro ao buscar faturamento:', err);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const content = document.getElementById('revenue-content');

    if (content) {
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 10);
        doc.save('faturamento.pdf');
      });
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: 'Faturamento (R$)',
        data: revenueData,
        backgroundColor: 'rgba(63, 81, 181, 0.6)', // Cor do gráfico
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container sx={{ mt: 5 }} id="revenue-content">
      <Typography variant="h4" gutterBottom>
        Faturamento
      </Typography>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Início"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="Fim"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant="contained" onClick={fetchRevenue}>
          Filtrar
        </Button>
        <Button variant="contained" color="secondary" onClick={handleExportPDF}>
          Exportar PDF
        </Button>
      </Box>
      {revenue !== null && (
        <>
          <Typography variant="h5" color="primary">
            Total: R$ {Number(revenue).toFixed(2)}
          </Typography>
          <Box mt={3}>
            <Bar data={data} options={{ responsive: true }} />
          </Box>
        </>
      )}
    </Container>
  );
}
