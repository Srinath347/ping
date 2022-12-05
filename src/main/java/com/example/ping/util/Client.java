package com.example.ping.util;

import javax.crypto.Cipher;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.EncodedKeySpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

public class Client {

    private static String keyFilePath = "/Users/srinath/Desktop/privateKeys/%s.key";

    public static void main(String[] args) throws Exception {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
        String firstName = bufferedReader.readLine();
        String nonce = bufferedReader.readLine();
        decrypt(firstName, nonce);
    }

    private static Integer decrypt(String firstName, String nonce) {
        try {
            String fileName = String.format(keyFilePath, firstName);
            System.out.println("Fetching key from: "+ fileName);
            File privateKeyFile = new File(fileName);
            byte[] privateKeyBytes = Files.readAllBytes(privateKeyFile.toPath());
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(privateKeyBytes);
            PrivateKey privateKey = keyFactory.generatePrivate(spec);
            Cipher decryptCipher = Cipher.getInstance("RSA");
            decryptCipher.init(Cipher.DECRYPT_MODE, privateKey);
            byte[] secretMessageBytes = nonce.getBytes(StandardCharsets.UTF_8);
            byte[] decryptedMessageBytes = decryptCipher.doFinal(secretMessageBytes);
            String decryptedMessage = new String(decryptedMessageBytes, StandardCharsets.UTF_8);
            System.out.println(decryptedMessage);
        } catch (Exception exception) {
            System.out.println("Unable to decrypt the message "+ exception.getLocalizedMessage());
        }
        return 1;
    }
}