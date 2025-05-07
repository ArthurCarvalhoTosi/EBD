import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Progress, Typography, Tooltip } from 'antd';
import { enviarResposta } from '../services/Api';
import './FormularioEBD.css';

const { TextArea } = Input;
const { Title } = Typography;

const FormularioEBD = () => {
  const [form] = Form.useForm();
  const [resultado, setResultado] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const handleSubmit = async (values) => {
    const { cpfs, resposta, email, telefone, cidade, estado } = values;

    const listaCpfs = cpfs.split(/[\n,;]+/).map(c => c.trim()).filter(Boolean);

    if (listaCpfs.length === 0) {
      alert('Nenhum CPF válido encontrado.');
      return;
    }

    setEnviando(true);
    setResultado([]);
    setProgresso(0);

    const total = listaCpfs.length;
    let completados = 0;

    for (const cpf of listaCpfs) {
      try {
        setResultado(prev => [...prev, { cpf, status: 'enviando', mensagem: 'Enviando...' }]);

        const result = await enviarResposta({ cpf, resposta, email, telefone, cidade, estado });
        
        setResultado(prev =>
          prev.map(item =>
            item.cpf === cpf
              ? {
                  ...item,
                  status: result?.sucesso ? 'sucesso' : 'erro',
                  mensagem: result?.sucesso ? 'Enviado com sucesso!' : result?.erro || 'Erro ao enviar respostas',
                }
              : item
          )
        );
      } catch (error) {
        setResultado(prev =>
          prev.map(item =>
            item.cpf === cpf
              ? { ...item, status: 'erro', mensagem: `Erro: ${error.message}` }
              : item
          )
        );
      }

      completados++;
      setProgresso(Math.floor((completados / total) * 100));
    }

    setEnviando(false);
  };

  return (
    <div className="formulario-container">
      <Title level={2}>Formulário de Envio de Respostas</Title>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Lista de CPFs (um por linha ou separados por vírgula)"
          name="cpfs"
          rules={[{ required: true, message: 'Por favor, insira a lista de CPFs' }]}
        >
          <TextArea rows={6} placeholder="12345678900&#10;98765432100" />
        </Form.Item>

        <Form.Item
          label="Resposta a ser enviada"
          name="resposta"
          rules={[
            { required: true, message: 'Por favor, insira a resposta' },
            { max: 3000, message: 'A resposta não pode ter mais de 3000 caracteres' }
          ]}
        >
          <TextArea rows={6} maxLength={3000} placeholder="Digite aqui a resposta que será enviada..." />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
          <Tooltip title={'Utilizado para caso o preenchimento automático dos dados não ocorra'}>
            <Form.Item label="E-mail (opcional)" name="email">
              <Input type="email" placeholder="email@exemplo.com" />
            </Form.Item>
            </Tooltip>
          </Col>
          <Col span={12}>
          <Tooltip title={'Utilizado para caso o preenchimento automático dos dados não ocorra'}>
            <Form.Item label="Telefone (opcional)" name="telefone">
              <Input placeholder="(99) 99999-9999" />
            </Form.Item>
            </Tooltip>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
          <Tooltip title={'Utilizado para caso o preenchimento automático dos dados não ocorra'}>
            <Form.Item label="Cidade (opcional)" name="cidade">
              <Input placeholder="São Paulo" />
            </Form.Item>
            </Tooltip>
          </Col>
          <Col span={12}>
          <Tooltip title={'Utilizado para caso o preenchimento automático dos dados não ocorra'}>
            <Form.Item label="Estado (opcional)" name="estado">
              <Input placeholder="SP" maxLength={2} />
            </Form.Item>
            </Tooltip>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={enviando}>
            {enviando ? 'Enviando...' : 'Enviar Respostas'}
          </Button>
        </Form.Item>
      </Form>

      {enviando && (
        <div style={{ marginTop: 20 }}>
          <Progress percent={progresso} />
        </div>
      )}

      {resultado.length > 0 && (
        <div className="resultado-container" style={{ marginTop: 24 }}>
          <Title level={4}>Resultados</Title>
          <ul className="resultado-lista">
            {resultado.map((item, key) => (
              <li key={item.cpf} className={`resultado-item ${item.status}`}>
                <strong>CPF: {item.cpf}</strong> - {item.mensagem}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FormularioEBD;
