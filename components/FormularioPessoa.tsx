import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent, ViewStyle, TextStyle, StyleProp, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { SPACING, COLORS, BORDER_RADIUS, TYPOGRAPHY } from '@/constants/DesignSystem';
import { useTheme } from '@/hooks/ThemeContext';
import { TextInput } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TextInputMask } from 'react-native-masked-text';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  ChevronDownIcon,
} from "@gluestack-ui/themed";
import { GluestackSelect } from './GluestackSelect';

type Theme = 'light' | 'dark';

interface Item {
  label: string;
  value: string | number;
}

interface FormularioPessoaProps {
  onCancel: () => void;
  onSave: (dados: any) => void;
}

interface ThemeContextType {
  currentTheme: Theme;
}

type SelectValue = string | number;

const GENEROS: Item[] = [
  { label: 'Masculino', value: 'masculino' },
  { label: 'Feminino', value: 'feminino' },
  { label: 'Outro', value: 'outro' },
  { label: 'Prefiro não informar', value: 'nao_informado' },
];

const ESTADOS_CIVIS: Item[] = [
  { label: 'Solteiro(a)', value: 'solteiro' },
  { label: 'Casado(a)', value: 'casado' },
  { label: 'Divorciado(a)', value: 'divorciado' },
  { label: 'Viúvo(a)', value: 'viuvo' },
  { label: 'União Estável', value: 'uniao_estavel' },
];

const ESCOLARIDADES: Item[] = [
  { label: 'Ensino Fundamental Incompleto', value: '1' },
  { label: 'Ensino Fundamental Completo', value: '2' },
  { label: 'Ensino Médio Incompleto', value: '3' },
  { label: 'Ensino Médio Completo', value: '4' },
  { label: 'Ensino Superior Incompleto', value: '5' },
  { label: 'Ensino Superior Completo', value: '6' },
  { label: 'Pós-graduação', value: '7' },
  { label: 'Mestrado', value: '8' },
  { label: 'Doutorado', value: '9' },
];

const PROFISSOES: Item[] = [
  { label: 'Administrador(a)', value: 'administrador' },
  { label: 'Professor(a)', value: 'professor' },
  { label: 'Engenheiro(a)', value: 'engenheiro' },
  { label: 'Médico(a)', value: 'medico' },
  { label: 'Advogado(a)', value: 'advogado' },
  { label: 'Empresário(a)', value: 'empresario' },
  { label: 'Comerciante', value: 'comerciante' },
  { label: 'Outro', value: 'outro' },
];

const LOCAIS_TRABALHO: Item[] = [
  { label: 'Escritório Central', value: '1' },
  { label: 'Filial A', value: '2' },
  { label: 'Filial B', value: '3' },
  { label: 'Home Office', value: '4' },
  { label: 'Outro', value: '5' },
];

const CARGOS: Item[] = [
  { label: 'Gerente', value: 'gerente' },
  { label: 'Coordenador', value: 'coordenador' },
  { label: 'Analista', value: 'analista' },
  { label: 'Assistente', value: 'assistente' },
  { label: 'Estagiário', value: 'estagiario' },
  { label: 'Outro', value: 'outro' },
];

const CIDADES: Item[] = [
  { label: 'São Paulo', value: 'sao_paulo' },
  { label: 'Rio de Janeiro', value: 'rio_de_janeiro' },
  { label: 'Belo Horizonte', value: 'belo_horizonte' },
  { label: 'Salvador', value: 'salvador' },
  { label: 'Brasília', value: 'brasilia' },
  { label: 'Outra', value: 'outra' },
];

export function FormularioPessoa({ onCancel, onSave }: FormularioPessoaProps) {
  const { currentTheme } = useTheme() as { currentTheme: Theme };
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [foto, setFoto] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  
  // Estado para dados pessoais (Etapa 1)
  const [dadosPessoais, setDadosPessoais] = useState({
    nome: '',
    apelido: '',
    ehLideranca: false,
    ligacaoLideranca: '',
    genero: '',
    telefone: '',
    dataNascimento: new Date(),
    estadoCivil: '',
    email: '',
    escolaridade: null as number | null,
    profissao: '',
    localVotacao: '',
    zona: '',
    secao: '',
    tituloEleitor: ''
  });

  // Estado para dados de trabalho (Etapa 2)
  const [dadosTrabalho, setDadosTrabalho] = useState({
    localTrabalho: null as number | null,
    cargo: '',
    emailTrabalho: '',
    telefoneTrabalho: ''
  });

  // Estado para dados de endereço (Etapa 3)
  const [dadosEndereco, setDadosEndereco] = useState({
    nomeRua: '',
    numeroImovel: '',
    bairro: '',
    cidade: '',
    cep: '',
    latitude: '',
    longitude: ''
  });

  const selecionarImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setFoto(result.assets[0].uri);
    }
  };

  const avancarEtapa = () => {
    if (etapaAtual < 3) {
      setEtapaAtual(etapaAtual + 1);
    } else {
      // Formatar dados para o formato do Supabase
      const dadosCompletos = {
        nome: dadosPessoais.nome,
        apelido: dadosPessoais.apelido,
        lideranca: dadosPessoais.ehLideranca,
        vinculo_Lideranca: dadosPessoais.ligacaoLideranca,
        genero: dadosPessoais.genero,
        telefone: dadosPessoais.telefone,
        dataNascimento: format(dadosPessoais.dataNascimento, 'yyyy-MM-dd'),
        estadoCivil: dadosPessoais.estadoCivil,
        email: dadosPessoais.email,
        grauInstrucao: dadosPessoais.escolaridade?.toString(),
        profissao: dadosPessoais.profissao,
        localTrabalho: dadosTrabalho.localTrabalho?.toString(),
        cargo: dadosTrabalho.cargo,
        nomeRua: dadosEndereco.nomeRua,
        numeroImovel: Number(dadosEndereco.numeroImovel),
        bairro: dadosEndereco.bairro,
        cidade: dadosEndereco.cidade,
        latitude: dadosEndereco.latitude,
        longitude: dadosEndereco.longitude,
        fotoURL: foto,
        Ativo: true,
        colaborador: false,
        dataCadastro: new Date().toISOString(),
      };

      onSave(dadosCompletos);
    }
  };

  const voltarEtapa = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    } else {
      onCancel();
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'E-mail inválido';
    }
    return '';
  };

  const handleEmailBlur = (email: string) => {
    const error = validateEmail(email);
    setEmailError(error);
  };

  const buscarCep = async (cep: string) => {
    if (cep.length !== 8) return;
    
    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setDadosEndereco({
          ...dadosEndereco,
          nomeRua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          cep: cep
        });
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setIsLoadingCep(false);
    }
  };

  const renderEtapa1 = () => (
    <ThemedView style={[styles.etapaContainer, { backgroundColor: COLORS[currentTheme].primaryBackground }]}>
      <ThemedText style={styles.etapaTitulo}>Dados Cadastrais</ThemedText>
      <ThemedView style={styles.subsecao}>
        <ThemedView style={styles.fotoContainer}>
          <TouchableOpacity onPress={selecionarImagem} style={styles.fotoPicker}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.fotoPreview} />
            ) : (
              <ThemedView style={styles.fotoPlaceholder}>
                <Feather name="camera" size={24} color={COLORS[currentTheme].icon} />
                <ThemedText style={styles.fotoText}>Adicionar foto</ThemedText>
                <ThemedText style={styles.fotoSubtext}>
                  Formatos: PNG, JPG, JPEG
                </ThemedText>
              </ThemedView>
            )}
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Nome Completo *</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            value={dadosPessoais.nome}
            onChangeText={(text) => setDadosPessoais({ ...dadosPessoais, nome: text })}
            placeholder="Digite o nome completo"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Apelido</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            value={dadosPessoais.apelido}
            onChangeText={(text) => setDadosPessoais({ ...dadosPessoais, apelido: text })}
            placeholder="Digite o apelido (opcional)"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>É uma liderança?</ThemedText>
          <ThemedView style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                dadosPessoais.ehLideranca && styles.radioButtonSelected
              ]}
              onPress={() => setDadosPessoais({ ...dadosPessoais, ehLideranca: true })}
            >
              <ThemedText style={[
                styles.radioText,
                dadosPessoais.ehLideranca && { color: '#FFFFFF' }
              ]}>Sim</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                !dadosPessoais.ehLideranca && styles.radioButtonSelected
              ]}
              onPress={() => setDadosPessoais({ ...dadosPessoais, ehLideranca: false, ligacaoLideranca: '' })}
            >
              <ThemedText style={[
                styles.radioText,
                !dadosPessoais.ehLideranca && { color: '#FFFFFF' }
              ]}>Não</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {dadosPessoais.ehLideranca && (
          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>Ligação com liderança</ThemedText>
            <Select
              selectedValue={dadosPessoais.ligacaoLideranca}
              onValueChange={(value: string) => setDadosPessoais({ ...dadosPessoais, ligacaoLideranca: value })}
            >
              <SelectTrigger>
                <SelectInput placeholder="Selecione uma liderança" />
                <SelectIcon>
                  <ChevronDownIcon />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {/* Aqui virão as lideranças do banco de dados */}
                </SelectContent>
              </SelectPortal>
            </Select>
          </ThemedView>
        )}

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Gênero</ThemedText>
          <GluestackSelect
            items={GENEROS}
            value={dadosPessoais.genero}
            onValueChange={(value) => setDadosPessoais({ ...dadosPessoais, genero: value.toString() })}
            placeholder="Selecione o gênero"
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Telefone (WhatsApp)</ThemedText>
          <TextInputMask
            type={'cel-phone'}
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) '
            }}
            value={dadosPessoais.telefone}
            onChangeText={(text) => setDadosPessoais({ ...dadosPessoais, telefone: text })}
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            placeholder="(00) 00000-0000"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
          />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.subsecao}>
        <ThemedText style={styles.subsecaoTitulo}>Dados Complementares</ThemedText>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Data de Nascimento</ThemedText>
          <TextInputMask
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY'
            }}
            value={format(dadosPessoais.dataNascimento, 'dd/MM/yyyy')}
            onChangeText={(text: string) => {
              const [day, month, year] = text.split('/');
              const date = new Date(Number(year), Number(month) - 1, Number(day));
              setDadosPessoais({ ...dadosPessoais, dataNascimento: date });
            }}
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Estado Civil</ThemedText>
          <GluestackSelect
            items={ESTADOS_CIVIS}
            value={dadosPessoais.estadoCivil}
            onValueChange={(value) => setDadosPessoais({ ...dadosPessoais, estadoCivil: value.toString() })}
            placeholder="Selecione o estado civil"
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>E-mail</ThemedText>
          <TextInput
            style={[
              styles.input, 
              { backgroundColor: COLORS[currentTheme].primaryBackground },
              emailError ? styles.inputError : {}
            ]}
            value={dadosPessoais.email}
            onChangeText={(text) => setDadosPessoais({ ...dadosPessoais, email: text })}
            onBlur={() => handleEmailBlur(dadosPessoais.email)}
            placeholder="Digite o e-mail"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? (
            <ThemedText style={styles.errorText}>{emailError}</ThemedText>
          ) : null}
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Escolaridade</ThemedText>
          <GluestackSelect
            items={ESCOLARIDADES}
            value={dadosPessoais.escolaridade}
            onValueChange={(value) => setDadosPessoais({ ...dadosPessoais, escolaridade: Number(value) })}
            placeholder="Selecione a escolaridade"
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Profissão</ThemedText>
          <GluestackSelect
            items={PROFISSOES}
            value={dadosPessoais.profissao}
            onValueChange={(value) => setDadosPessoais({ ...dadosPessoais, profissao: value.toString() })}
            placeholder="Selecione a profissão"
          />
        </ThemedView>
      </ThemedView>

      <ThemedView style={[styles.subsecao, { marginBottom: 0 }]}>
        <ThemedText style={styles.subsecaoTitulo}>Dados de Votação</ThemedText>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Local de Votação</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            value={dadosPessoais.localVotacao}
            onChangeText={(text) => setDadosPessoais({ ...dadosPessoais, localVotacao: text })}
            placeholder="Digite o local de votação"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Zona</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            value={dadosPessoais.zona}
            onChangeText={(text) => setDadosPessoais({ ...dadosPessoais, zona: text })}
            placeholder="Digite a zona eleitoral"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
            keyboardType="numeric"
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Seção</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            value={dadosPessoais.secao}
            onChangeText={(text) => setDadosPessoais({ ...dadosPessoais, secao: text })}
            placeholder="Digite a seção eleitoral"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
            keyboardType="numeric"
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Título de Eleitor</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            value={dadosPessoais.tituloEleitor}
            onChangeText={(text) => setDadosPessoais({ ...dadosPessoais, tituloEleitor: text })}
            placeholder="Digite o número do título de eleitor"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
            keyboardType="numeric"
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderEtapa2 = () => (
    <ThemedView style={[styles.etapaContainer, { backgroundColor: COLORS[currentTheme].primaryBackground }]}>
      <ThemedText style={styles.etapaTitulo}>Dados Profissionais</ThemedText>
      <ThemedView style={[styles.subsecao, { marginBottom: 0 }]}>
        <ThemedText style={styles.subsecaoTitulo}>Dados Complementares</ThemedText>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Local de Trabalho</ThemedText>
          <GluestackSelect
            items={LOCAIS_TRABALHO}
            value={dadosTrabalho.localTrabalho}
            onValueChange={(value) => setDadosTrabalho({ ...dadosTrabalho, localTrabalho: Number(value) })}
            placeholder="Selecione o local de trabalho"
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Cargo</ThemedText>
          <GluestackSelect
            items={CARGOS}
            value={dadosTrabalho.cargo}
            onValueChange={(value) => setDadosTrabalho({ ...dadosTrabalho, cargo: value.toString() })}
            placeholder="Selecione o cargo"
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>E-mail Profissional</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            value={dadosTrabalho.emailTrabalho}
            onChangeText={(text) => setDadosTrabalho({ ...dadosTrabalho, emailTrabalho: text })}
            placeholder="Digite o e-mail profissional"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Telefone Profissional</ThemedText>
          <TextInputMask
            type={'cel-phone'}
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) '
            }}
            value={dadosTrabalho.telefoneTrabalho}
            onChangeText={(text) => setDadosTrabalho({ ...dadosTrabalho, telefoneTrabalho: text })}
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            placeholder="(00) 00000-0000"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderEtapa3 = () => (
    <ThemedView style={[styles.etapaContainer, { backgroundColor: COLORS[currentTheme].primaryBackground }]}>
      <ThemedText style={styles.etapaTitulo}>Endereço</ThemedText>
      <ThemedView style={[styles.subsecao, { marginBottom: 0 }]}>
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>CEP</ThemedText>
          <ThemedView style={styles.cepContainer}>
            <TextInputMask
              type={'custom'}
              options={{
                mask: '99999-999'
              }}
              value={dadosEndereco.cep}
              onChangeText={(text: string) => {
                const numericCep = text.replace(/\D/g, '');
                setDadosEndereco({ ...dadosEndereco, cep: text });
                if (numericCep.length === 8) {
                  buscarCep(numericCep);
                }
              }}
              style={[
                styles.input,
                { backgroundColor: COLORS[currentTheme].primaryBackground, flex: 1 }
              ]}
              placeholder="00000-000"
              placeholderTextColor={COLORS[currentTheme].secondaryText}
              keyboardType="numeric"
            />
            {isLoadingCep && (
              <ActivityIndicator 
                size="small" 
                color={COLORS[currentTheme].primary}
                style={styles.cepLoader}
              />
            )}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Nome da Rua</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            value={dadosEndereco.nomeRua}
            onChangeText={(text) => setDadosEndereco({ ...dadosEndereco, nomeRua: text })}
            placeholder="Digite o nome da rua"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
            editable={false}
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Número do Imóvel</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            value={dadosEndereco.numeroImovel}
            onChangeText={(text) => setDadosEndereco({ ...dadosEndereco, numeroImovel: text })}
            placeholder="Digite o número"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
            keyboardType="numeric"
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Bairro</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            value={dadosEndereco.bairro}
            onChangeText={(text) => setDadosEndereco({ ...dadosEndereco, bairro: text })}
            placeholder="Digite o bairro"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
            editable={false}
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Cidade</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
            value={dadosEndereco.cidade}
            onChangeText={(text) => setDadosEndereco({ ...dadosEndereco, cidade: text })}
            placeholder="Digite a cidade"
            placeholderTextColor={COLORS[currentTheme].secondaryText}
            editable={false}
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Latitude e Longitude</ThemedText>
          <ThemedView style={styles.coordenadasContainer}>
            <TextInput
              style={[styles.inputCoordenada, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
              value={dadosEndereco.latitude}
              onChangeText={(text) => setDadosEndereco({ ...dadosEndereco, latitude: text })}
              placeholder="Latitude"
              placeholderTextColor={COLORS[currentTheme].secondaryText}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.inputCoordenada, { backgroundColor: COLORS[currentTheme].primaryBackground }]}
              value={dadosEndereco.longitude}
              onChangeText={(text) => setDadosEndereco({ ...dadosEndereco, longitude: text })}
              placeholder="Longitude"
              placeholderTextColor={COLORS[currentTheme].secondaryText}
              keyboardType="numeric"
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    },
    header: {
      paddingVertical: SPACING.lg,
      alignItems: 'center',
    },
    titulo: {
      ...TYPOGRAPHY.mobile.headlineSmall,
      marginBottom: SPACING.xs,
    },
    subtitulo: {
      ...TYPOGRAPHY.mobile.labelMedium,
    },
    progressBar: {
      height: 4,
      backgroundColor: COLORS.light.divider,
      borderRadius: BORDER_RADIUS.pill,
      overflow: 'hidden',
      marginBottom: SPACING.xl,
    },
    progressIndicator: {
      height: '100%',
      backgroundColor: COLORS.light.primary,
      borderRadius: BORDER_RADIUS.pill,
    },
    content: {
      flex: 1,
      paddingHorizontal: SPACING.md,
    },
    secao: {
      marginBottom: SPACING.xl,
    },
    secaoTitulo: {
      ...TYPOGRAPHY.mobile.labelLarge,
      marginBottom: SPACING.md,
    },
    fotoContainer: {
      alignItems: 'center',
      marginBottom: SPACING.xl,
      width: '100%',
    },
    fotoPicker: {
      width: 150,
      height: 150,
      borderRadius: 75,
      overflow: 'hidden',
      backgroundColor: COLORS[currentTheme].secondaryBackground,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: COLORS[currentTheme].primary,
      borderStyle: 'dashed',
    },
    fotoPreview: {
      width: '100%',
      height: '100%',
    },
    fotoPlaceholder: {
      alignItems: 'center',
      width: '100%',
      padding: SPACING.md,
    },
    fotoText: {
      ...TYPOGRAPHY.mobile.labelMedium,
      color: COLORS[currentTheme].primaryText,
      marginTop: SPACING.sm,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: SPACING.md,
    },
    label: {
      ...TYPOGRAPHY.mobile.labelMedium,
      marginBottom: SPACING.xs,
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderColor: COLORS[currentTheme].divider,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      backgroundColor: COLORS[currentTheme].primaryBackground,
      color: COLORS[currentTheme].primaryText,
      ...Platform.select({
        web: {
          outlineStyle: 'none',
        },
      }),
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.light.divider,
    },
    button: {
      flex: 1,
      height: 40,
      borderRadius: BORDER_RADIUS.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: SPACING.xs,
    },
    buttonPrimary: {
      backgroundColor: COLORS.light.primary,
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: COLORS.light.primary,
    },
    buttonText: {
      ...TYPOGRAPHY.mobile.labelMedium,
      color: '#FFFFFF',
    },
    buttonTextSecondary: {
      color: COLORS.light.primary,
    },
    radioGroup: {
      flexDirection: 'row',
      gap: SPACING.md,
    },
    radioButton: {
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS[currentTheme].primary,
    },
    radioButtonSelected: {
      backgroundColor: COLORS[currentTheme].primary,
    },
    radioText: {
      ...TYPOGRAPHY.mobile.labelMedium,
      color: COLORS[currentTheme].primary,
    },
    fotoSubtext: {
      ...TYPOGRAPHY.mobile.small,
      color: COLORS[currentTheme].secondaryText,
      marginTop: SPACING.xs,
      textAlign: 'center',
    },
    coordenadasContainer: {
      flexDirection: 'row',
      gap: SPACING.md,
    },
    inputCoordenada: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: COLORS[currentTheme].divider,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      backgroundColor: COLORS[currentTheme].primaryBackground,
      color: COLORS[currentTheme].primaryText,
      ...Platform.select({
        web: {
          outlineStyle: 'none',
        },
      }),
    },
    etapa1Container: {
      flex: 1,
    },
    stepIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    stepCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: COLORS[currentTheme].primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.sm,
    },
    stepNumber: {
      ...TYPOGRAPHY.mobile.labelMedium,
      color: '#FFFFFF',
    },
    stepTitle: {
      ...TYPOGRAPHY.mobile.headlineSmall,
      color: COLORS[currentTheme].primaryText,
    },
    subsecao: {
      marginBottom: SPACING.xl,
      borderWidth: 1,
      borderColor: COLORS[currentTheme].divider,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
    },
    subsecaoTitulo: {
      ...TYPOGRAPHY.mobile.labelLarge,
      color: COLORS[currentTheme].primary,
      marginBottom: SPACING.md,
    },
    inputError: {
      borderColor: COLORS[currentTheme].error,
    },
    errorText: {
      ...TYPOGRAPHY.mobile.small,
      color: COLORS[currentTheme].error,
      marginTop: SPACING.xs,
    },
    cepContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cepLoader: {
      marginLeft: SPACING.sm,
    },
    etapaContainer: {
      flex: 1,
      padding: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      borderColor: COLORS.light.divider,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 3.84,
      elevation: 5,
    },
    etapaTitulo: {
      ...TYPOGRAPHY.mobile.labelLarge,
      color: COLORS[currentTheme].primary,
      marginBottom: SPACING.md,
    },
    botoesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.light.divider,
    },
    botao: {
      flex: 1,
      height: 40,
      borderRadius: BORDER_RADIUS.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: SPACING.xs,
    },
    botaoVoltar: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: COLORS[currentTheme].primary,
    },
    botaoAvancar: {
      backgroundColor: COLORS[currentTheme].primary,
    },
    botaoTexto: {
      ...TYPOGRAPHY.mobile.labelMedium,
    },
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.titulo}>Cadastro de Pessoa</ThemedText>
        <ThemedText style={styles.subtitulo}>
          Etapa {etapaAtual} de 3
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.progressBar}>
        <ThemedView 
          style={[
            styles.progressIndicator, 
            { 
              width: `${(etapaAtual / 3) * 100}%`
            }
          ]} 
        />
      </ThemedView>

      <ThemedView style={styles.content}>
        {etapaAtual === 1 && renderEtapa1()}
        {etapaAtual === 2 && renderEtapa2()}
        {etapaAtual === 3 && renderEtapa3()}
      </ThemedView>

      <ThemedView style={styles.botoesContainer}>
        <TouchableOpacity
          style={[
            styles.botao,
            styles.botaoVoltar,
            { borderColor: COLORS[currentTheme].primary }
          ]}
          onPress={voltarEtapa}
        >
          <ThemedText style={[styles.botaoTexto, { color: COLORS[currentTheme].primary }]}>
            {etapaAtual === 1 ? 'Cancelar' : 'Voltar'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botao,
            styles.botaoAvancar,
            { backgroundColor: COLORS[currentTheme].primary }
          ]}
          onPress={avancarEtapa}
        >
          <ThemedText style={[styles.botaoTexto, { color: '#fff' }]}>
            {etapaAtual === 3 ? 'Salvar' : 'Avançar'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
} 