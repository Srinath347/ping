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
import java.util.Optional;
import java.util.stream.Collectors;

public class Client {

    private static String keyFilePath = "/Users/srinath/Desktop/ping/keys/%s.key";

    static HashMap<Integer, User> userData;

    public static List<User> getAllUsers() {
        if (userData == null || userData.isEmpty()) {
            initialize();
        }
        return new ArrayList<>(userData.values());
    }

    private static void initialize() {

        System.out.println("Initializing user data");
        userData = new HashMap<>();
        userData.put(1, userBuilder("John", "doe", 1));
        userData.put(2, userBuilder("Srinath", "Reddy", 2 ));
        userData.put(3, userBuilder("Sanjana", "Thomas", 3 ));
        userData.put(4, userBuilder("Mathew", "Shejo", 4 ));
        userData.put(5, userBuilder("Aishwarya", "Donekal", 5));
        System.out.println("user data initialized: " + userData.toString());
    }

    private static User userBuilder(String firstName, String lastName, int id) {
        return User.builder()
                .id(id)
                .firstName(firstName)
                .lastName(lastName)
                .isIdle(true)
                .build();
    }

    public static List<User> getAllIdleUsers() {
        List<User> idleUsers= new ArrayList<>(userData.values().stream().filter(User::isIdle).collect(Collectors.toList()));
        List<User> usersList = new ArrayList<>();
        idleUsers.stream().forEach(idleUser -> {
            User user = new User();
            user.setId(idleUser.getId());
            user.setIdle(idleUser.isIdle());
            user.setFirstName(idleUser.getFirstName());
            user.setLastName(idleUser.getLastName());
            usersList.add(user);
        });
        return usersList;
    }

    public static User verifyValidUser(int id) {
        User validUser = new User();
        if(userData.containsKey(id)) {
            if(userData.get(id).isIdle()) {
                User user = userData.get(id);
                validUser.setId(id);
                validUser.setIdle(user.isIdle());
                validUser.setFirstName(user.getFirstName());
                validUser.setLastName(user.getLastName());
                return validUser;
            }
        }
        return null;
    }

    public static User updateUserStatus(int id, String status) {
        User validUser = new User();

        if(userData.containsKey(id)) {
            User user = userData.get(id);
            if (status.equalsIgnoreCase("busy")) {
                user.setIdle(false);
            }
            else if (status.equalsIgnoreCase("idle")) {
                user.setIdle(true);
            }
            userData.put(id, user);
            validUser.setId(id);
            validUser.setIdle(user.isIdle());
            validUser.setFirstName(user.getFirstName());
            validUser.setLastName(user.getLastName());
            return validUser;
        }
        return null;
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

    public static User getUserById(int id) {
        User validUser = new User();
        if(userData.containsKey(id)) {
            User user = userData.get(id);
            validUser.setId(id);
            validUser.setIdle(user.isIdle());
            validUser.setFirstName(user.getFirstName());
            validUser.setLastName(user.getLastName());
            return validUser;
        }
        return validUser;
    }

    public static Optional<User> getUserByName(String name) {
        Optional<User> users = userData.values().stream().filter((user) ->user.getFirstName().equalsIgnoreCase(name)).findFirst();
        return users;
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
