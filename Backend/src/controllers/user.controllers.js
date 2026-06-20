import { User } from '../models/user.models.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'quicklog-dev-secret-key-2024'
const JWT_EXPIRES_IN = '7d'

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password.'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    })

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isProfileUpdated: user.isProfileUpdated
        }
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      })
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }

    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isProfileUpdated:user.isProfileUpdated,
          age: user.age,
          gender: user.gender,
          height: user.height,
          weight: user.weight
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    })
  }
}

export const updateProfile = async(req,res)=>{
  try{
    const { username, age, gender, weight, height } = req.body

    if(!username || !age || !gender || !weight || !height){
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields.'
      })
    }

    const user = await User.findById(req.user.id)
    if(!user){
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      })
    }

    user.username = username
    user.age = age
    user.gender = gender
    user.weight = weight
    user.height = height
    user.isProfileUpdated = true

    await user.save()

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        gender: user.gender,
        weight: user.weight,
        height: user.height,
        isProfileUpdated: user.isProfileUpdated
      }
    })
  }catch(error){
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    })
  }
}