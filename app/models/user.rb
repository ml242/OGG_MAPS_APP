class User < ActiveRecord::Base
  attr_accessible :name, :email, :lng, :lat

end
