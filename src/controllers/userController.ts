export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    // Get current user to toggle the status
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Update user status
    const updatedUser = {
      _id: user._id,
      isActive: !user.isActive
    };
    
    await User.findByIdAndUpdate(
      req.params.id,
      { isActive: !user.isActive },
      { new: true }
    );

    res.send(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
  }
}; 