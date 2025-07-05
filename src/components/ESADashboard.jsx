import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download, Printer, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import logoOAB from '../assets/LOGOOAB.png';
import esaContractsData from '../assets/CONTRATOSESA.json';
import esaValuesData from '../assets/VALORESESAEXCEL.json';
import * as XLSX from 'xlsx';

const ESADashboard = ({ onLogout, onNavigateBack }) => {
  const [selectedNaturezas, setSelectedNaturezas] = useState([
    'SERV TECNICOS E PROFISSIONAIS',
    'SERV DE AUDIO VIDEO E FOTO',
    'CESSAO E USO DE IMAGEM'
  ]);

  // Filtrar apenas contratos ativos
  const activeContracts = useMemo(() => {
    return esaContractsData.filter(contract => contract.STATUS === 'VIGENTE');
  }, []);

  // Função para criar link do protocolo
  const createProtocolLink = (protocol) => {
    if (!protocol || protocol === 'N/A') return null;
    return `https://documento.oab.org.br/arquivos/${protocol.trim()}`;
  };

  // Preparar dados do gráfico
  const chartData = useMemo(() => {
    // Agrupar valores por mês/ano e natureza
    const groupedData = {};
    
    esaValuesData.forEach(item => {
      const monthYear = item['MM/AAAA'];
      const natureza = item.NATUREZA;
      const valor = parseFloat(item.VALOR) || 0;
      
      if (selectedNaturezas.includes(natureza)) {
        if (!groupedData[monthYear]) {
          groupedData[monthYear] = {};
        }
        if (!groupedData[monthYear][natureza]) {
          groupedData[monthYear][natureza] = 0;
        }
        groupedData[monthYear][natureza] += valor;
      }
    });

    // Converter para formato do gráfico
    const chartArray = Object.keys(groupedData)
      .sort((a, b) => {
        const [monthA, yearA] = a.split('/');
        const [monthB, yearB] = b.split('/');
        const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1);
        const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1);
        return dateA - dateB;
      })
      .map(monthYear => {
        const data = { monthYear };
        selectedNaturezas.forEach(natureza => {
          data[natureza] = groupedData[monthYear][natureza] || 0;
        });
        
        // Calcular total para tooltip
        data.total = selectedNaturezas.reduce((sum, natureza) => {
          return sum + (data[natureza] || 0);
        }, 0);
        
        return data;
      });

    return chartArray;
  }, [selectedNaturezas]);

  // Cores para as linhas do gráfico
  const colors = {
    'SERV TECNICOS E PROFISSIONAIS': '#3B82F6',
    'SERV DE AUDIO VIDEO E FOTO': '#EF4444',
    'CESSAO E USO DE IMAGEM': '#10B981'
  };

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Exportar contratos para Excel
  const exportContractsToExcel = () => {
    const headers = [
      'Empresa', 'Num. Contrato', 'Protocolo Contrato', 'Tipo de Contrato',
      'Pagamento', 'Periodicidade', 'Status'
    ];

    const data = activeContracts.map(row => [
      row.EMPRESA || '',
      row['NUM. CONTRATO '] || '',
      row['PROTOCOLO CONTRATO'] || '',
      row['TIPO DE CONTRATO'] || '',
      row.PAGAMENTO || '',
      row.PERIODICIDADE || '',
      row.STATUS || ''
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contratos ESA');
    XLSX.writeFile(wb, 'contratos_esa_uso_imagem.xlsx');
  };

  // Imprimir contratos
  const handlePrintContracts = () => {
    const printContent = document.getElementById('esa-contracts-table');
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Contratos ESA - Uso de Imagem</title>
          <style>
            @page { 
              size: landscape; 
              margin: 0.5in; 
            }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 10px; 
              margin: 0; 
              padding: 0;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              font-size: 9px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 4px; 
              text-align: left; 
              white-space: nowrap;
            }
            th { 
              background-color: #f5f5f5; 
              font-weight: bold; 
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              font-size: 16px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">ESCOLA SUPERIOR DE ADVOCACIA NACIONAL [ESA NACIONAL]<br>CESSAO TEMPORARIA USO DE IMAGEM<br>Contratos Ativos (${activeContracts.length} contratos)</div>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  // Toggle natureza no filtro
  const toggleNatureza = (natureza) => {
    setSelectedNaturezas(prev => {
      if (prev.includes(natureza)) {
        return prev.filter(n => n !== natureza);
      } else {
        return [...prev, natureza];
      }
    });
  };

  // Tooltip customizado para o gráfico
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
          <p className="font-semibold border-t pt-1">
            {`Total: ${formatCurrency(total)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={logoOAB} alt="Logo OAB Nacional" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">ESCOLA SUPERIOR DE ADVOCACIA NACIONAL [ESA NACIONAL]</h1>
                <p className="text-lg text-gray-600">CESSAO TEMPORARIA USO DE IMAGEM</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={onNavigateBack}
                variant="outline"
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button 
                onClick={onLogout}
                variant="outline"
                className="text-gray-600 hover:text-gray-800"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-6 py-6 space-y-6">
        {/* Tabela de Contratos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Contratos Ativos ({activeContracts.length} contratos)
              </CardTitle>
              <div className="flex space-x-2">
                <Button onClick={handlePrintContracts} variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button onClick={exportContractsToExcel} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-8">
            <div className="overflow-x-auto">
              <table id="esa-contracts-table" className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium">Empresa</th>
                    <th className="text-left p-3 font-medium">Num. Contrato</th>
                    <th className="text-left p-3 font-medium">Protocolo Contrato</th>
                    <th className="text-left p-3 font-medium">Tipo de Contrato</th>
                    <th className="text-left p-3 font-medium">Pagamento</th>
                    <th className="text-left p-3 font-medium">Periodicidade</th>
                    <th className="text-left p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeContracts.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">{row.EMPRESA || ''}</td>
                      <td className="p-3">{row['NUM. CONTRATO '] || ''}</td>
                      <td className="p-3">
                        {createProtocolLink(row['PROTOCOLO CONTRATO']) ? (
                          <a 
                            href={createProtocolLink(row['PROTOCOLO CONTRATO'])} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {row['PROTOCOLO CONTRATO']}
                          </a>
                        ) : (
                          row['PROTOCOLO CONTRATO'] === 'N/A' ? '' : row['PROTOCOLO CONTRATO']
                        )}
                      </td>
                      <td className="p-3">{row['TIPO DE CONTRATO'] || ''}</td>
                      <td className="p-3">{row.PAGAMENTO || ''}</td>
                      <td className="p-3">{row.PERIODICIDADE || ''}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {row.STATUS || ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Valores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Gráfico de Valores por Mês/Ano</CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* Filtros de Natureza */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Filtros por Natureza:</h3>
              <div className="flex flex-wrap gap-2">
                {['SERV TECNICOS E PROFISSIONAIS', 'SERV DE AUDIO VIDEO E FOTO', 'CESSAO E USO DE IMAGEM'].map(natureza => (
                  <button
                    key={natureza}
                    onClick={() => toggleNatureza(natureza)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedNaturezas.includes(natureza)
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {natureza}
                  </button>
                ))}
              </div>
            </div>

            {/* Gráfico */}
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="monthYear" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {selectedNaturezas.map(natureza => (
                    <Line
                      key={natureza}
                      type="monotone"
                      dataKey={natureza}
                      stroke={colors[natureza]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ESADashboard;

