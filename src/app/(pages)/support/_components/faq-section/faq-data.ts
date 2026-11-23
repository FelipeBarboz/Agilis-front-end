export interface FaqItemData {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FaqItemData[] = [
  {
    id: "1",
    question: "Como faço para contratar um serviço?",
    answer:
      "Basta buscar o serviço desejado na barra de pesquisa, escolher um profissional disponível na sua região e confirmar o agendamento. Você receberá uma confirmação por e-mail.",
  },
  {
    id: "2",
    question: "Como funciona o pagamento?",
    answer:
      "O pagamento é realizado diretamente na plataforma após a conclusão do serviço. Aceitamos cartão de crédito, débito e Pix.",
  },
  {
    id: "3",
    question: "Posso cancelar um serviço agendado?",
    answer:
      "Sim, é possível cancelar um agendamento com até 2 horas de antecedência sem custo. Cancelamentos fora desse prazo podem gerar uma taxa.",
  },
  {
    id: "4",
    question: "Os profissionais são verificados?",
    answer:
      "Sim, todos os profissionais passam por verificação de identidade e antecedentes antes de serem listados na plataforma.",
  },
  {
    id: "5",
    question: "O que fazer se tiver um problema com o serviço?",
    answer:
      "Entre em contato conosco pelo formulário abaixo ou acesse o histórico de serviços e abra uma reclamação diretamente no pedido.",
  },
];
