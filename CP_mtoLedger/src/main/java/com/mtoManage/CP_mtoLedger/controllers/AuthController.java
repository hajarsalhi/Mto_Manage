package com.mtoManage.CP_mtoLedger.controllers;

import com.mtoManage.CP_mtoLedger.dto.AuthRequest;
import com.mtoManage.CP_mtoLedger.dto.AuthResponse;
import com.mtoManage.CP_mtoLedger.models.User;
import com.mtoManage.CP_mtoLedger.security.JwtTokenUtil;
import com.mtoManage.CP_mtoLedger.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Get the UserDetails object
            org.springframework.security.core.userdetails.User userDetails = 
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
            
            // Find the actual User entity using the username
            User user = userService.findByUsername(userDetails.getUsername());
            
            if (!user.isActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new AuthResponse(null, "Account is disabled"));
            }
            
            String token = jwtTokenUtil.generateToken(user);
            
            return ResponseEntity.ok(new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getFirstName() + " " + user.getLastName(),
                user.getRole().toString()
            ));
            
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse(null, "Invalid username or password"));
        }
    }
} 