package com.example.ping.util;

import com.example.ping.model.User;

import java.io.File;
import java.nio.file.Files;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

public class ClientUtil {

    static HashMap<Integer, User> userData;

    private static String keyFilePath = "/Users/srinath/Desktop/ping/keys/%s.key";

    public static List<User> getAllUsers() {
        if (userData == null || userData.isEmpty()) {
            initialize();
        }
        return new ArrayList<>(userData.values());
    }

    private static void initialize() {

        System.out.println("Initializing user data");
        userData = new HashMap<>();
        userData.put(1, userBuilder("John", "doe" ,1));
        userData.put(2, userBuilder("Srinath", "Reddy",2));
        userData.put(3, userBuilder("Sanjana", "Thomas" , 3));
        userData.put(4, userBuilder("Mathew", "Shejo" , 4));
        userData.put(5, userBuilder("Aishwarya", "Donekal", 5));
        System.out.println("user data initialized: " + userData.toString());
    }

    private static User userBuilder(String firstName, String lastName, int id) {
        return User.builder()
                .id(id)
                .firstName(firstName)
                .lastName(lastName)
                .isIdle(true)
                .email(firstName+""+lastName+"@gmail.com")
                .build();
    }

    public static List<User> getAllIdleUsers() {
        return userData.values().stream().filter(User::isIdle).collect(Collectors.toList());
    }

    public static void setUserStatus(int id, boolean status) {
        if (!userData.containsKey(id)) {
            System.out.println("User not found");
            return;
        }
        User user = userData.get(id);
        user.setIdle(status);
        userData.put(id, user);
    }

    private static String getPrivateKey(String firstName) {

        switch (firstName) {
            case "Srinath":
            case "Sanjana":
            case "Mathew":
            case "Aishwarya":
            case "John":
            default:
                System.out.println("User not found");
        }
        return "";
    }

    private static String getPublicKey(String firstName) {

        switch (firstName) {
            case "Srinath":
            case "Sanjana":
            case "Mathew":
            case "Aishwarya":
            case "John":
            default:
                System.out.println("User not found");
        }
        return "";
    }

    private static PublicKey getPublicKeyById(int id) {
        if (!userData.containsKey(id)) {
            System.out.println("User not found");
            return null;
        }
        String firstName = userData.get(id).getFirstName();
        return getPublicKeyByFirstName(firstName);
    }

    public static PublicKey getPublicKeyByFirstName(String firstName) {
        try {
            String fileName = String.format(keyFilePath, firstName);
            System.out.println("Fetching key from: "+ fileName);
            File publicKeyFile = new File(fileName);
            byte[] publicKeyBytes = Files.readAllBytes(publicKeyFile.toPath());
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(publicKeyBytes);
            return keyFactory.generatePublic(publicKeySpec);
        } catch (Exception exception) {
            System.out.println("Could not find or load key, please try again"+ exception.getLocalizedMessage());
        }
        return null;
    }
}
