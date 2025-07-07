import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { ChevronDown, ChevronUp, Download, Printer, Search, X } from 'lucide-react';
import logoOAB from '../assets/LOGOOAB.png';
import contractsData from '../assets/JSONEXCEL.json';
import * as XLSX from 'xlsx';

const Dashboard = ({ onLogout, onNavigateToESA }) => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);
  const [filters, setFilters] = useState({
    centroCusto: '',
    incluirPontual: true,
    busca: '',
    campoBusca: '',
    status: 'todos'
  });

  // Extrair valores únicos para os filtros
  const centrosCusto = useMemo(() => {
    const centros = [...new Set(contractsData.map(item => item['CENTRO DE CUSTO']))];
    return centros.filter(centro => centro && centro !== 'N/A').sort();
  }, []);

  // Função para formatar datas
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'N/A') return '';
    
    // Se já está no formato DD/MM/AAAA, retorna como está
    if (dateStr.includes('/') && dateStr.split('/').length === 3) {
      const parts = dateStr.split('/');
      if (parts[0].length === 2) return dateStr; // Já está no formato correto
    }
    
    // Converte de MM/DD/AAAA para DD/MM/AAAA
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    if (!value || value === 'N/A') return '';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  };

  // Função para criar link do protocolo
  const createProtocolLink = (protocol) => {
    if (!protocol || protocol === 'N/A') return null;
    return `https://documento.oab.org.br/arquivos/${protocol}`;
  };

  // Filtrar dados
  const filteredData = useMemo(() => {
    return contractsData.filter(item => {
      // Filtro por centro de custo
      if (filters.centroCusto && item['CENTRO DE CUSTO'] !== filters.centroCusto) {
        return false;
      }

      // Filtro por periodicidade pontual
      if (!filters.incluirPontual && item.PERIODICIDADE === 'PONTUAL') {
        return false;
      }

      // Filtro por status
      if (filters.status !== 'todos') {
        if (filters.status === 'vigente' && item.STATUS !== 'VIGENTE') return false;
        if (filters.status === 'vencido' && item.STATUS !== 'VENCIDO') return false;
      }

      // Filtro de busca
      if (filters.busca && filters.campoBusca) {
        const searchValue = filters.busca.toLowerCase();
        const fieldValue = item[filters.campoBusca];
        
        if (!fieldValue || fieldValue === 'N/A') return false;
        
        return fieldValue.toString().toLowerCase().includes(searchValue);
      }

      return true;
    });
  }, [filters]);



  // NOVO: Calcular os totais
  const totalValorContrato = useMemo(() => {
    return filteredData.reduce((sum, item) => {
      const valor = parseFloat(item['VALOR CONTRATO']) || 0;
      return sum + valor;
    }, 0);
  }, [filteredData]);

  const totalValorPago = useMemo(() => {
    return filteredData.reduce((sum, item) => {
      const valor = parseFloat(item['VALOR']) || 0;
      return sum + valor;
    }, 0);
  }, [filteredData]);






  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      centroCusto: '',
      incluirPontual: true,
      busca: '',
      campoBusca: '',
      status: 'todos'
    });
  };


 


  // Exportar para Excel
  const exportToExcel = () => {
    const headers = [
      'Centro de Custo', 'Empresa', 'Num. Contrato', 'Protocolo Contrato',
      'Valor Contrato', 'CNPJ', 'Tipo de Contrato', 'Pagamento',
      'Periodicidade', 'Status', 'Data Último Pagamento', 'Valor', 'Protocolo Pagamento'
    ];

    const data = filteredData.map(row => [
      row['CENTRO DE CUSTO'] || '',
      row.EMPRESA || '',
      row['NUM. CONTRATO '] || '',
      row['PROTOCOLO CONTRATO'] || '',
      formatCurrency(row['VALOR CONTRATO']),
      row.CNPJ || '',
      row['TIPO DE CONTRATO'] || '',
      row.PAGAMENTO || '',
      row.PERIODICIDADE || '',
      row.STATUS || '',
      formatDate(row['DATA ULTIMO PAGAMENTO']),
      formatCurrency(row.VALOR),
      row['PROTOCOLO PAGAMENTO'] || ''
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contratos CFOAB');
    XLSX.writeFile(wb, 'contratos_cfoab.xlsx');
  };

  // Imprimir apenas a área de resultados
  const handlePrint = () => {
    const printContent = document.getElementById('results-table');
    const originalContent = document.body.innerHTML;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Contratos CFOAB</title>
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
              font-size: 8px;
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
          <div class="header">CONTRATOS CFOAB - Resultados (${filteredData.length} contratos)</div>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={logoOAB} alt="Logo OAB Nacional" className="h-12 w-auto" />
              <h1 className="text-2xl font-bold text-gray-800">CONTRATOS CFOAB</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={onNavigateToESA}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                CONTRATOS ESA - USO DE IMAGEM
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

      <div className="max-w-full mx-auto px-6 py-6">
        {/* Área de Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Filtros</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                className="flex items-center space-x-2"
              >
                <span>{isFiltersVisible ? 'Minimizar' : 'Expandir'}</span>
                {isFiltersVisible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          
          {isFiltersVisible && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Centro de Custo */}
                <div className="space-y-2">
                  <Label>Centro de Custo</Label>
                  <select 
                    value={filters.centroCusto} 
                    onChange={(e) => setFilters(prev => ({ ...prev, centroCusto: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Todos</option>
                    {centrosCusto.map(centro => (
                      <option key={centro} value={centro}>{centro}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select 
                    value={filters.status} 
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="todos">Todos</option>
                    <option value="vigente">Vigente</option>
                    <option value="vencido">Vencido</option>
                  </select>
                </div>

                {/* Campo de Busca */}
                <div className="space-y-2">
                  <Label>Campo de Busca</Label>
                  <select 
                    value={filters.campoBusca} 
                    onChange={(e) => setFilters(prev => ({ ...prev, campoBusca: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecione o campo</option>
                    <option value="EMPRESA">Empresa</option>
                    <option value="CENTRO DE CUSTO">Centro de Custo</option>
                    <option value="PROTOCOLO PAGAMENTO">Protocolo Pagamento</option>
                    <option value="PROTOCOLO CONTRATO">Protocolo Contrato</option>
                  </select>
                </div>

                {/* Texto de Busca */}
                <div className="space-y-2">
                  <Label>Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      value={filters.busca}
                      onChange={(e) => setFilters(prev => ({ ...prev, busca: e.target.value }))}
                      placeholder="Digite para buscar..."
                      className="pl-10"
                      disabled={!filters.campoBusca}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pontual"
                    checked={filters.incluirPontual}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, incluirPontual: checked }))}
                  />
                  <Label htmlFor="pontual" className="text-sm">
                    Contratos Pontuais
                  </Label>
                </div>

                <Button onClick={clearFilters} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Área de Resultados */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Resultados ({filteredData.length} contratos) — Total Contrato: {formatCurrency(totalValorContrato)} | Total Últimos Pagamentos Realizados: {formatCurrency(totalValorPago)}
              </CardTitle>
              <div className="flex space-x-2">
                <Button onClick={handlePrint} variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button onClick={exportToExcel} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-8">
            <div className="overflow-x-auto">
              <table id="results-table" className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium">Centro de Custo</th>
                    <th className="text-left p-3 font-medium">Empresa</th>
                    <th className="text-left p-3 font-medium">Num. Contrato</th>
                    <th className="text-left p-3 font-medium">Protocolo Contrato</th>
                    <th className="text-left p-3 font-medium">Valor Contrato</th>
                    <th className="text-left p-3 font-medium">CNPJ</th>
                    <th className="text-left p-3 font-medium">Tipo de Contrato</th>
                    <th className="text-left p-3 font-medium">Pagamento</th>
                    <th className="text-left p-3 font-medium">Periodicidade</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Data Último Pagamento</th>
                    <th className="text-left p-3 font-medium">Valor</th>
                    <th className="text-left p-3 font-medium">Protocolo Pagamento</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">{row['CENTRO DE CUSTO'] || ''}</td>
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
                      <td className="p-3">{formatCurrency(row['VALOR CONTRATO'])}</td>
                      <td className="p-3">{row.CNPJ || ''}</td>
                      <td className="p-3">{row['TIPO DE CONTRATO'] || ''}</td>
                      <td className="p-3">{row.PAGAMENTO || ''}</td>
                      <td className="p-3">{row.PERIODICIDADE || ''}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.STATUS === 'VIGENTE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {row.STATUS || ''}
                        </span>
                      </td>
                      <td className="p-3">{formatDate(row['DATA ULTIMO PAGAMENTO'])}</td>
                      <td className="p-3">{formatCurrency(row.VALOR)}</td>
                      <td className="p-3">
                        {createProtocolLink(row['PROTOCOLO PAGAMENTO']) ? (
                          <a 
                            href={createProtocolLink(row['PROTOCOLO PAGAMENTO'])} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {row['PROTOCOLO PAGAMENTO']}
                          </a>
                        ) : (
                          row['PROTOCOLO PAGAMENTO'] === 'N/A' ? '' : row['PROTOCOLO PAGAMENTO']
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

