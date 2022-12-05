package com.authapp.util;

import com.authapp.model.Auth;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;
import java.net.*;
import java.security.*;
import java.security.spec.*;

@Service
public class AuthUtil {

        private static String keyFilePath = "/Users/shejomathew/Desktop/ping/privateKeys/%s.key";

        public static String userSignIn(String userName) throws Exception {
            URL url = new URL("http://localhost:8080/signin/"+userName);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();

            int nonce = decrypt(userName, content.toString());
            nonce+=1;
            return signNonceAndVerifyWithServer(userName, nonce+"");
        }

        private static int decrypt(String firstName, String nonce) throws Exception {
            try {
                PrivateKey privateKey = getPrivateKey(firstName);
                Cipher decryptCipher = Cipher.getInstance("RSA");
                decryptCipher.init(Cipher.DECRYPT_MODE, privateKey);
                byte[] secretMessageBytes = Base64.getDecoder().decode(nonce);
                byte[] decryptedMessageBytes = decryptCipher.doFinal(secretMessageBytes);
                int decryptedMessage = Integer.parseInt(new String(decryptedMessageBytes, StandardCharsets.UTF_8));
                return decryptedMessage;
            } catch (Exception exception) {
                System.out.println("Unable to decrypt the message "+ exception.getLocalizedMessage());
            }
            return 1;
        }

        private static PrivateKey getPrivateKey(String firstName) throws Exception {
            String fileName = String.format(keyFilePath, firstName);
            File privateKeyFile = new File(fileName);
            byte[] privateKeyBytes = Files.readAllBytes(privateKeyFile.toPath());
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(privateKeyBytes);
            PrivateKey privateKey = keyFactory.generatePrivate(spec);
            return privateKey;
        }

        private static String signNonceAndVerifyWithServer(String userName, String nonce) throws Exception {
            PrivateKey privateKey = getPrivateKey(userName);
            Signature privateSignature = Signature.getInstance("SHA256withRSA");
            privateSignature.initSign(privateKey);
            privateSignature.update(nonce.getBytes(StandardCharsets.UTF_8));
            byte[] signature = privateSignature.sign();

            String signedString = Base64.getEncoder().encodeToString(signature);
            Auth auth = new Auth();
            auth.setNonce(nonce);
            auth.setSignature(signedString);
            auth.setFirstName(userName);
            URL url = new URL("http://localhost:8080/verify");
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestMethod("POST");
            urlConnection.setRequestProperty("Content-Type", "application/json");
            urlConnection.setRequestProperty("Accept", "application/json");
            urlConnection.setDoOutput(true);
            urlConnection.connect();
            String jsonInputString = "";
            try {
                jsonInputString = createJSONInputString(auth);
            } catch (Exception exception) {
                System.out.println(exception);
            }

            try(OutputStream os = urlConnection.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            } catch (Exception exception) {
                System.out.println(exception);
            }
            BufferedReader in = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            return content.toString();
        }

        private static String createJSONInputString(Auth auth) throws JsonProcessingException {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(auth);
        }
}
