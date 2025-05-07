package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;

@Entity
@Table(name = "Product", schema = "dbo")
public class Product {
    @Id
    @Column(name = "nId")
    private Integer id;
    
    @Column(name = "bShow")
    private Boolean show;
    
    @OneToOne(mappedBy = "product")
    private TresoProduct tresoProduct;
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Boolean getShow() {
        return show;
    }

    public void setShow(Boolean show) {
        this.show = show;
    }
    
    public TresoProduct getTresoProduct() {
        return tresoProduct;
    }

    public void setTresoProduct(TresoProduct tresoProduct) {
        this.tresoProduct = tresoProduct;
    }
} 