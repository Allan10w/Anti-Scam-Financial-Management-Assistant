package com.example.demo.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
@Entity
@Data
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String accountName;
    private double balance;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "transaction_user_id")
    private TransactionUser transactionUser;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<TransactionRecord> transactionRecords;


}
