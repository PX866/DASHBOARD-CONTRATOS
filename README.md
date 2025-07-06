# Dashboard CONTRATOS CFOAB - Versão Atualizada

Dashboard profissional interativo para gestão de contratos do CFOAB com nova seção especializada para contratos da ESA Nacional.

## 🚀 **FUNCIONALIDADES PRINCIPAIS**

### **Sistema de Autenticação**
- Tela de login segura
- Credenciais: **** / ****
- Logo oficial da OAB Nacional integrada

### **Dashboard Principal - Contratos CFOAB**
- **Tabela Completa**: Visualização de todos os 154 contratos
- **Formatação Brasileira**: Valores em R$ X.XXX,XX e datas DD/MM/AAAA
- **Links Interativos**: Protocolos clicáveis para contratos válidos
- **Status Visuais**: Badges coloridos para status dos contratos

#### **Sistema de Filtros Avançados**
- **Centro de Custo**: Dropdown com todos os centros disponíveis
- **Status**: Vigente, Vencido, Todos
- **Busca Textual**: Por Empresa, Centro de Custo, Protocolo Pagamento, Protocolo Contrato
- **Contratos Pontuais**: Checkbox para incluir/excluir contratos pontuais
- **Limpar Filtros**: Remove todos os filtros aplicados

#### **Funcionalidades de Exportação e Impressão**
- **Exportar Excel (XLSX)**: Exporta apenas os resultados filtrados
- **Imprimir**: Impressão otimizada em paisagem apenas dos resultados
- **Minimizar/Expandir**: Controle da área de filtros

### **Nova Seção - ESA Nacional**
#### **ESCOLA SUPERIOR DE ADVOCACIA NACIONAL [ESA NACIONAL]**
**CESSÃO TEMPORÁRIA USO DE IMAGEM**

- **Tabela de Contratos Ativos**: 36 contratos da ESA
- **Links Clicáveis**: Protocolos de contrato interativos
- **Exportação Excel**: Funcionalidade específica para contratos ESA
- **Impressão Otimizada**: Layout em paisagem para melhor visualização

#### **Gráfico Interativo de Valores**
- **Eixo Y**: Valores em R$
- **Eixo X**: Períodos (Mês/Ano) - Ex: 01/2024, 04/2024
- **Tooltip Interativo**: Mostra soma dos valores ao passar o mouse
- **Filtros por Natureza**:
  - SERV TÉCNICOS E PROFISSIONAIS
  - SERV DE ÁUDIO VÍDEO E FOTO
  - CESSÃO E USO DE IMAGEM
- **Seleção Múltipla**: Permite combinar diferentes naturezas no gráfico

## 🔧 **MELHORIAS IMPLEMENTADAS**

### **Ajustes Solicitados**
1. **Impressão Otimizada**: Imprime apenas resultados em formato paisagem
2. **Exportação Excel**: Substituição do CSV por formato XLSX profissional
3. **Texto Atualizado**: "Contratos Pontuais" (texto simplificado)
4. **Layout Melhorado**: Margens expandidas para melhor visualização dos resultados

### **Nova Arquitetura**
- **Navegação entre Seções**: Botão dedicado para acesso à seção ESA
- **Componentes Modulares**: Dashboard principal e ESA separados
- **Dados Integrados**: Utilização dos novos arquivos JSON fornecidos

## 📁 **ESTRUTURA DO PROJETO**

```
dashboard-cfoab/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Dashboard principal
│   │   ├── ESADashboard.jsx       # Seção ESA Nacional
│   │   ├── LoginPage.jsx          # Tela de login
│   │   └── ui/                    # Componentes UI
│   ├── assets/
│   │   ├── JSONEXCEL.json         # Dados contratos principais
│   │   ├── CONTRATOSESA.json      # Dados contratos ESA
│   │   ├── VALORESESAEXCEL.json   # Dados valores para gráfico
│   │   └── LOGOOAB.png           # Logo oficial
│   └── App.jsx                    # Aplicação principal
├── dist/                          # Build de produção
└── README.md                      # Esta documentação
```

## 🚀 **COMO EXECUTAR**

### **Desenvolvimento Local**
```bash
# 1. Extrair o projeto
tar -xzf dashboard-cfoab-atualizado.tar.gz

# 2. Entrar na pasta
cd dashboard-cfoab

# 3. Instalar dependências
pnpm install
# ou
npm install

# 4. Executar em modo desenvolvimento
pnpm run dev
# ou
npm run dev

# 5. Acessar no navegador
http://localhost:5173
```

### **Build de Produção**
```bash
# Gerar build otimizado
pnpm run build
# ou
npm run build

# Arquivos gerados em: ./dist/
```

## 🔐 **CREDENCIAIS DE ACESSO**
- **Usuário**: GOF
- **Senha**: @Oab2025

## 🎯 **TECNOLOGIAS UTILIZADAS**
- **React 18** + **Vite** (Framework principal)
- **Tailwind CSS** + **Shadcn/UI** (Estilização)
- **Recharts** (Gráficos interativos)
- **XLSX** (Exportação Excel)
- **Lucide React** (Ícones)

## 📊 **DADOS UTILIZADOS**
- **JSONEXCEL.json**: 154 contratos principais do CFOAB
- **CONTRATOSESA.json**: 36 contratos ativos da ESA Nacional
- **VALORESESAEXCEL.json**: Dados históricos de valores para gráfico

## ✅ **FUNCIONALIDADES TESTADAS**
- ✅ Login e autenticação
- ✅ Filtros e busca no dashboard principal
- ✅ Exportação Excel (ambas as seções)
- ✅ Impressão otimizada em paisagem
- ✅ Navegação entre seções
- ✅ Gráfico interativo com filtros de natureza
- ✅ Tooltips com valores formatados
- ✅ Links clicáveis de protocolos
- ✅ Responsividade mobile e desktop

## 🎨 **DESIGN PROFISSIONAL**
- Interface moderna e intuitiva
- Cores institucionais da OAB
- Layout responsivo para todos os dispositivos
- Animações suaves e micro-interações
- Tipografia profissional e legível

---

**Desenvolvido para o Conselho Federal da Ordem dos Advogados do Brasil (CFOAB)**
*Sistema de Gestão de Contratos - Versão 2.0*

