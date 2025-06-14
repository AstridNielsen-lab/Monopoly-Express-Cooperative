import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.List;
import java.util.ArrayList;

public class TestDesktop {
    private static JFrame mainFrame;
    private static java.util.List<Corrida> corridas = new ArrayList<>();
    private static int proximoId = 1;

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            createMainWindow();
        });
    }

    private static void createMainWindow() {
        mainFrame = new JFrame("Cooperativa Motoboy - Teste Desktop");
        mainFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        mainFrame.setSize(400, 300);
        mainFrame.setLocationRelativeTo(null);
        
        JPanel panel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        
        // Título
        JLabel title = new JLabel("Cooperativa Motoboy");
        title.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 24));
        title.setForeground(new Color(33, 150, 243));
        gbc.gridx = 0; gbc.gridy = 0; gbc.gridwidth = 2; gbc.insets = new Insets(20, 0, 30, 0);
        panel.add(title, gbc);
        
        // Botão Cliente
        JButton btnCliente = new JButton("CLIENTE");
        btnCliente.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 16));
        btnCliente.setPreferredSize(new Dimension(200, 50));
        btnCliente.setBackground(new Color(76, 175, 80));
        btnCliente.setForeground(Color.WHITE);
        btnCliente.setFocusPainted(false);
        btnCliente.addActionListener(e -> openClienteWindow());
        gbc.gridx = 0; gbc.gridy = 1; gbc.gridwidth = 2; gbc.insets = new Insets(10, 0, 10, 0);
        panel.add(btnCliente, gbc);
        
        // Botão Motoboy
        JButton btnMotoboy = new JButton("MOTOBOY");
        btnMotoboy.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 16));
        btnMotoboy.setPreferredSize(new Dimension(200, 50));
        btnMotoboy.setBackground(new Color(255, 152, 0));
        btnMotoboy.setForeground(Color.WHITE);
        btnMotoboy.setFocusPainted(false);
        btnMotoboy.addActionListener(e -> openMotoboyWindow());
        gbc.gridx = 0; gbc.gridy = 2; gbc.gridwidth = 2; gbc.insets = new Insets(10, 0, 20, 0);
        panel.add(btnMotoboy, gbc);
        
        mainFrame.add(panel);
        mainFrame.setVisible(true);
    }
    
    private static void openClienteWindow() {
        JFrame clienteFrame = new JFrame("Area do Cliente");
        clienteFrame.setSize(450, 400);
        clienteFrame.setLocationRelativeTo(mainFrame);
        
        JPanel panel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        
        // Campos do formulário
        JTextField enderecoColeta = new JTextField(20);
        JTextField enderecoEntrega = new JTextField(20);
        JTextField descricao = new JTextField(20);
        JTextField valorFrete = new JTextField(20);
        
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.anchor = GridBagConstraints.WEST;
        
        gbc.gridx = 0; gbc.gridy = 0;
        panel.add(new JLabel("Endereço de Coleta:"), gbc);
        gbc.gridx = 1;
        panel.add(enderecoColeta, gbc);
        
        gbc.gridx = 0; gbc.gridy = 1;
        panel.add(new JLabel("Endereço de Entrega:"), gbc);
        gbc.gridx = 1;
        panel.add(enderecoEntrega, gbc);
        
        gbc.gridx = 0; gbc.gridy = 2;
        panel.add(new JLabel("Descrição:"), gbc);
        gbc.gridx = 1;
        panel.add(descricao, gbc);
        
        gbc.gridx = 0; gbc.gridy = 3;
        panel.add(new JLabel("Valor do Frete (R$):"), gbc);
        gbc.gridx = 1;
        panel.add(valorFrete, gbc);
        
        JButton btnEnviar = new JButton("Enviar Solicitação");
        btnEnviar.setBackground(new Color(76, 175, 80));
        btnEnviar.setForeground(Color.WHITE);
        btnEnviar.setFocusPainted(false);
        btnEnviar.addActionListener(e -> {
            try {
                String coleta = enderecoColeta.getText().trim();
                String entrega = enderecoEntrega.getText().trim();
                String desc = descricao.getText().trim();
                double valor = Double.parseDouble(valorFrete.getText().trim());
                
                if (coleta.isEmpty() || entrega.isEmpty() || valor <= 0) {
                    JOptionPane.showMessageDialog(clienteFrame, "Preencha todos os campos obrigatórios!");
                    return;
                }
                
                Corrida novaCorrida = new Corrida();
                novaCorrida.setId(proximoId++);
                novaCorrida.setEnderecoColeta(coleta);
                novaCorrida.setEnderecoEntrega(entrega);
                novaCorrida.setDescricao(desc);
                novaCorrida.setValorFrete(valor);
                novaCorrida.setStatus("AGUARDANDO");
                
                corridas.add(novaCorrida);
                
                JOptionPane.showMessageDialog(clienteFrame, 
                    "Corrida #" + novaCorrida.getId() + " criada com sucesso!\nStatus: Aguardando Motoboy");
                
                // Limpar campos
                enderecoColeta.setText("");
                enderecoEntrega.setText("");
                descricao.setText("");
                valorFrete.setText("");
                
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(clienteFrame, "Valor do frete inválido!");
            }
        });
        
        gbc.gridx = 0; gbc.gridy = 4; gbc.gridwidth = 2;
        gbc.insets = new Insets(20, 5, 5, 5);
        panel.add(btnEnviar, gbc);
        
        clienteFrame.add(panel);
        clienteFrame.setVisible(true);
    }
    
    private static void openMotoboyWindow() {
        JFrame motoboyFrame = new JFrame("Area do Motoboy");
        motoboyFrame.setSize(600, 500);
        motoboyFrame.setLocationRelativeTo(mainFrame);
        
        JPanel mainPanel = new JPanel(new BorderLayout());
        
        // Botão atualizar
        JButton btnAtualizar = new JButton("Atualizar Lista");
        btnAtualizar.setBackground(new Color(255, 152, 0));
        btnAtualizar.setForeground(Color.WHITE);
        btnAtualizar.setFocusPainted(false);
        
        // Area de lista
        JPanel listPanel = new JPanel();
        listPanel.setLayout(new BoxLayout(listPanel, BoxLayout.Y_AXIS));
        JScrollPane scrollPane = new JScrollPane(listPanel);
        
        ActionListener atualizarLista = e -> {
            listPanel.removeAll();
            
            java.util.List<Corrida> disponveis = new ArrayList<>();
            for (Corrida c : corridas) {
                if ("AGUARDANDO".equals(c.getStatus())) {
                    disponveis.add(c);
                }
            }
            
            if (disponveis.isEmpty()) {
                JLabel noRides = new JLabel("Nenhuma corrida disponível no momento");
                noRides.setHorizontalAlignment(SwingConstants.CENTER);
                listPanel.add(noRides);
            } else {
                for (Corrida corrida : disponveis) {
                    JPanel corridaPanel = createCorridaPanel(corrida, listPanel, motoboyFrame);
                    listPanel.add(corridaPanel);
                    listPanel.add(Box.createVerticalStrut(10));
                }
            }
            
            listPanel.revalidate();
            listPanel.repaint();
        };
        
        btnAtualizar.addActionListener(atualizarLista);
        
        mainPanel.add(btnAtualizar, BorderLayout.NORTH);
        mainPanel.add(scrollPane, BorderLayout.CENTER);
        
        motoboyFrame.add(mainPanel);
        
        // Atualizar lista inicial
        atualizarLista.actionPerformed(null);
        
        motoboyFrame.setVisible(true);
    }
    
    private static JPanel createCorridaPanel(Corrida corrida, JPanel listPanel, JFrame parent) {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(Color.GRAY),
            BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));
        panel.setBackground(Color.WHITE);
        
        JPanel infoPanel = new JPanel(new GridLayout(0, 1));
        infoPanel.add(new JLabel("Corrida #" + corrida.getId()));
        infoPanel.add(new JLabel("Coleta: " + corrida.getEnderecoColeta()));
        infoPanel.add(new JLabel("Entrega: " + corrida.getEnderecoEntrega()));
        if (!corrida.getDescricao().isEmpty()) {
            infoPanel.add(new JLabel("Descrição: " + corrida.getDescricao()));
        }
        infoPanel.add(new JLabel("Valor: R$ " + String.format("%.2f", corrida.getValorFrete())));
        
        JButton btnAceitar = new JButton("Aceitar Corrida");
        btnAceitar.setBackground(new Color(255, 152, 0));
        btnAceitar.setForeground(Color.WHITE);
        btnAceitar.setFocusPainted(false);
        btnAceitar.addActionListener(e -> {
            corrida.setStatus("ACEITA");
            JOptionPane.showMessageDialog(parent, "Corrida #" + corrida.getId() + " aceita com sucesso!");
            
            // Remover da lista
            Container parentContainer = panel.getParent();
            parentContainer.remove(panel);
            parentContainer.revalidate();
            parentContainer.repaint();
        });
        
        panel.add(infoPanel, BorderLayout.CENTER);
        panel.add(btnAceitar, BorderLayout.EAST);
        
        return panel;
    }
    
    // Classe Corrida simplificada
    static class Corrida {
        private int id;
        private String enderecoColeta;
        private String enderecoEntrega;
        private String descricao;
        private double valorFrete;
        private String status;
        
        // Getters e Setters
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        public String getEnderecoColeta() { return enderecoColeta; }
        public void setEnderecoColeta(String enderecoColeta) { this.enderecoColeta = enderecoColeta; }
        public String getEnderecoEntrega() { return enderecoEntrega; }
        public void setEnderecoEntrega(String enderecoEntrega) { this.enderecoEntrega = enderecoEntrega; }
        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }
        public double getValorFrete() { return valorFrete; }
        public void setValorFrete(double valorFrete) { this.valorFrete = valorFrete; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}

