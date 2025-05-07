package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Partner_X", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerX {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nPartnerId")
    private Integer partnerId;

    @Column(name = "sSenderFirstName", length = 70)
    private String senderFirstName;

    @Column(name = "sSenderLastName", length = 70)
    private String senderLastName;

    @Column(name = "sSenderAddress", length = 50)
    private String senderAddress;

    @Column(name = "sSenderCity", length = 15)
    private String senderCity;

    @Column(name = "sSenderEmail", length = 30)
    private String senderEmail;

    @Column(name = "sSenderPhone", length = 20)
    private String senderPhone;

    @Column(name = "sSenderPostalCod", length = 10)
    private String senderPostalCode;

    @Column(name = "sReceiverFirstName", length = 70)
    private String receiverFirstName;

    @Column(name = "sReceiverLastName", length = 70)
    private String receiverLastName;

    @Column(name = "sReceiverAddress", length = 100)
    private String receiverAddress;

    @Column(name = "sReceiverCity", length = 20)
    private String receiverCity;

    @Column(name = "sReceiverPhone", length = 25)
    private String receiverPhone;

    @Column(name = "sSendAmount", precision = 11, scale = 2)
    private BigDecimal sendAmount;

    @Column(name = "sSendCurrency", length = 20)
    private String sendCurrency;

    @Column(name = "nReceiveAmount", precision = 11, scale = 2)
    private BigDecimal receiveAmount;

    @Column(name = "sReceiveCurrency", length = 5)
    private String receiveCurrency;

    @Column(name = "sTrackingNumber", length = 50)
    private String trackingNumber;

    @Column(name = "dInsertion")
    private LocalDateTime insertion;

    @Column(name = "dPaid")
    private LocalDateTime paidDateTime;

    @Column(name = "bPaid")
    private Boolean isPaid;

    @Column(name = "nTransactionId")
    private Integer transactionId;

    @Column(name = "nCustomerId")
    private Integer customerId;

    @Column(name = "bTimeout")
    private Boolean timeout = false;

    @Column(name = "nPartner_id")
    private Integer partnerId;

    @Column(name = "rate", precision = 9, scale = 2)
    private BigDecimal rate;

    @Column(name = "data_json", columnDefinition = "text")
    private String dataJson;

    @Column(name = "nProductType")
    private Integer productType;

    @Column(name = "sSenderIdNumber", length = 50)
    private String senderIdNumber;

    @Column(name = "sSenderCountry", length = 100)
    private String senderCountry;

    @Column(name = "dSenderDateOfBirth")
    private LocalDateTime senderDateOfBirth;

    @Column(name = "sReceiverIdNumber", length = 50)
    private String receiverIdNumber;

    @Column(name = "sReceiverCountry", length = 100)
    private String receiverCountry;

    @Column(name = "dReceiverDateOfBirth")
    private LocalDateTime receiverDateOfBirth;

    @Column(name = "sTransferReason", length = 255)
    private String transferReason;

    @Column(name = "sInternalTrackingNumber", length = 255)
    private String internalTrackingNumber;

    @Column(name = "sOriginatingCountry", length = 255)
    private String originatingCountry;

    @Column(name = "sDestinationCountry", length = 255)
    private String destinationCountry;

    @Column(name = "sTrackingNumber2", length = 255)
    private String trackingNumber2;

    @Column(name = "receiverMiddleName", length = 50)
    private String receiverMiddleName;

    @Column(name = "Payment_request_id")
    private Integer paymentRequestId;

    @Column(name = "shopId")
    private Integer shopId;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "senderMiddleName", length = 50)
    private String senderMiddleName;

    @Column(name = "sStatus", length = 50)
    private String sStatus;

    @Column(name = "dLastStatus")
    private LocalDateTime lastStatus;

    @Column(name = "sUUID", length = 100)
    private String uuid;

    @Column(name = "dPaidDate")
    private LocalDate paidDate;

    @Column(name = "dInsertionDate")
    private LocalDate insertionDate;

    @Column(name = "sPartnerCode", length = 50)
    private String partnerCode;

    @Column(name = "nAppVersion")
    private Integer appVersion;

    @Column(name = "dSent")
    private LocalDate sent;
} 