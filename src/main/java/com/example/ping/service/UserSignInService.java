package com.example.ping.service;


import com.example.ping.model.UserBasic;
import com.example.ping.model.VerifyUser;
import com.example.ping.util.Client;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import java.security.*;
import java.util.Base64;
import java.util.List;
import java.util.Random;

import static java.nio.charset.StandardCharsets.UTF_8;

@Service
public class UserSignInService {

    public String signIn(String firstName) {
        PublicKey key = Client.getPublicKeyByFirstName(firstName);
        Random random = new Random();
        Integer nonce = random.nextInt();
        System.out.println("Random nonce: " + nonce);
        String encryptedMessage = encrypt(nonce, key);
        return encryptedMessage;
    }

    public List<UserBasic> verify(VerifyUser verifyUser) {
        String firstName = verifyUser.getFirstName();
        String nonce = verifyUser.getNonce();
        String signature = verifyUser.getSignature();
        try {
            System.out.println(verifyUser.toString());
            Signature publicSignature = Signature.getInstance("SHA256withRSA");
            PublicKey key = Client.getPublicKeyByFirstName(firstName);
            publicSignature.initVerify(key);
            publicSignature.update(nonce.getBytes(UTF_8));
            byte[] signatureBytes = Base64.getDecoder().decode(signature);
            if(publicSignature.verify(signatureBytes)) {
                return Client.getAllIdleUsers();
            }
        } catch (Exception e) {
            System.out.println("Failed to verify user sign"+e.getLocalizedMessage());
            return null;
        }
        return null;
    }

    private String encrypt(Integer nonce, PublicKey key) {
        try {
            Cipher encryptCipher = Cipher.getInstance("RSA");
            encryptCipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] secretMessageBytes = nonce.toString().getBytes(UTF_8);
            byte[] encryptedMessageBytes = encryptCipher.doFinal(secretMessageBytes);
            String encodedMessage = Base64.getEncoder().encodeToString(encryptedMessageBytes);
            return encodedMessage;
        } catch (Exception exception) {
            System.out.println("Failed to encrypt the message");
            return null;
        }
    }
}
